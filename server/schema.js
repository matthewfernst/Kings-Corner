import fs from "fs";
import path from "path";

import { gql } from "apollo-server-express";

const schema = [fs.readFileSync(path.join(__dirname, "../schema.graphql"), "utf8")];
const typeDefs = gql(schema);

import * as query from "./Query";
import * as mutation from "./Mutation";
import * as subscription from "./Subscription";

import * as user from "./User";
import * as playerStatistics from "./User/PlayerStatistics";
import * as battlePass from "./User/BattlePass";

import * as match from "./Match";
import * as matchResults from "./MatchResults";

import * as message from "./Message";

const resolvers = {
	Query: query,
	Mutation: mutation,
	Subscription: subscription,
	User: user,
	PlayerStatistics: playerStatistics,
	BattlePass: battlePass,
	Match: match,
	MatchResults: matchResults,
	Message: message
};

export { typeDefs, resolvers };
