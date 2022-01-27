import express from "express";

import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import * as Redis from "ioredis";

import { ApolloServer, AuthenticationError } from "apollo-server-express";
const {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageDisabled
} = require("apollo-server-core");
import { express as voyagerMiddleware } from "graphql-voyager/middleware/index.js";

import dotenv from "dotenv";

import { promises as fs } from "fs";
import handlebars from "handlebars";

import AppleSignIn from "apple-signin-auth";

import { authenticateHTTPAccessToken, generateAccessToken } from "./auth.js";
import { client } from "./db.js";
import mocks from "./mocking.js";
import { typeDefs, resolvers } from "./schema.js";
import createUser from "./Mutation/createUser.js";

const redisOptions = { host: process.env.REDIS_HOST };
const pubsub =
	process.env.NODE_ENV === "development"
		? new PubSub()
		: new RedisPubSub({
				publisher: new Redis(redisOptions),
				subscriber: new Redis(redisOptions)
		  });

const app = express();
const serverMocks = process.env.MOCK ? mocks : undefined;

dotenv.config();

const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

await client.connect();

const graphQlPath = "/graphql";

const subscriptionServer = SubscriptionServer.create(
	{
		schema,
		execute,
		subscribe,
		async onConnect(connectionParams) {
			if (!connectionParams.authorization)
				throw new AuthenticationError(
					"Authentication Token Must Be Provided For Subscriptions"
				);
			return {
				userId: authenticateHTTPAccessToken({ headers: connectionParams }),
				db: client.db("Kings-Corner"),
				pubsub: pubsub
			};
		}
	},
	{
		server: httpServer,
		path: graphQlPath
	}
);

const server = new ApolloServer({
	schema,
	mocks: serverMocks,
	formatError: (err) => {
		if (!err.extensions) {
			throw Error("Extensions Object Does Not Exist On Error");
		}
		if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
			if (err.extensions) console.error(`${err.extensions.code}: ${err.message}`);
			else console.error(err);
		}
		if (process.env.NODE_ENV === "development") {
			console.log(err);
		}
		return err;
	},
	context: async ({ req }) => {
		return {
			userId: authenticateHTTPAccessToken(req),
			db: client.db("Kings-Corner"),
			pubsub: pubsub
		};
	},
	plugins: [
		{
			async serverWillStart() {
				return {
					async drainServer() {
						subscriptionServer.close();
					}
				};
			}
		},
		process.env.NODE_ENV === "development"
		? ApolloServerPluginLandingPageLocalDefault({ footer: false })

			: ApolloServerPluginLandingPageDisabled()
	]
});

await server.start();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/apple-login", async (req, res) => {
	if (!req.body || !req.body.id_token) return res.sendFile(__dirname + "/website/index.html");
	const data = await AppleSignIn.verifyIdToken(req.body.id_token, {
		audience: "com.meta-games.kings-corner-service",
		ignoreExpiration: true
	});

	const userRecord = await client
		.db("Kings-Corner")
		.collection("Users")
		.findOne({ email: data.email });

	let redirectAddress;
	let token;
	if (!!userRecord) {
		redirectAddress = !!userRecord.username ? "/app/dashboard" : "/finalize-account";
		token = generateAccessToken(userRecord._id.toString());
	} else {
		redirectAddress = "/finalize-account";
		token = await createUser(
			undefined,
			{ email: data.email },
			{ db: client.db("Kings-Corner") },
			undefined
		);
	}
	const file = await fs.readFile(__dirname + "/website/index.html");
	const template = handlebars.compile(file.toString());
	const replacements = {
		appleLogin: `localStorage.setItem("token", '${token}');
		window.location.href="${redirectAddress}";`
	};
	return res.send(template(replacements));
});

if (process.env.NODE_ENV === "development") {
	app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
} else {
	const file = await fs.readFile(__dirname + "/website/index.html");
	const template = handlebars.compile(file.toString());
	const replacements = {
		appleLogin:
			"const easterEgg = 'If you found this, you should collaborate with us on GitHub. Check out https://github.com/Meta-Games-Biz/Kings-Corner'"
	};
	const convertedHTML = template(replacements);

	app.get("index.html", (req, res) => res.send(convertedHTML));
	app.use(express.static(__dirname + "/website"));
	app.get("*", (req, res) => res.send(convertedHTML));
}

await server.applyMiddleware({ app });

httpServer.listen(process.env.PORT);

console.info(`🚀 Server Ready at localhost:${process.env.PORT}${graphQlPath}`);
console.info(`🚀 Subscriptions Ready at ws://localhost:${process.env.PORT}${graphQlPath}`);
