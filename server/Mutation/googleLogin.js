import { OAuth2Client } from "google-auth-library";

import dotenv from "dotenv";

import { generateAccessToken } from "../auth.js";
import createUser from "./createUser.js";

dotenv.config();

const googleLogin = async (_, args, context, info) => {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	const ticket = await client.verifyIdToken({
		idToken: args.token,
		audience: process.env.GOOGLE_CLIENT_ID
	});
	const { email, picture, name } = ticket.getPayload();
	const userRecord = await context.db.collection("Users").findOne({ email });
	if (userRecord) {
		return {
			token: generateAccessToken(userRecord._id.toString()),
			redirectPath: userRecord.username ? "/app" : "/finalize-account"
		};
	}
	return {
		token: await createUser(undefined, { email, avatar: picture, name }, context, undefined),
		redirectPath: "/finalize-account"
	};
};

export default googleLogin;
