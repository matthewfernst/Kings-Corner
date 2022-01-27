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

import { resolveType } from "./Match/*";
import * as matchTwoPlayer from "./Match/MatchTwoPlayer";
import * as matchFourPlayer from "./Match/MatchFourPlayer";
import * as matchResults from "./Match/MatchResults";

import * as message from "./Message";

const resolvers = {
	Query: query,
	Mutation: mutation,
	Subscription: subscription,
	User: user,
	PlayerStatistics: playerStatistics,
	BattlePass: battlePass,
	Match: { __resolveType: resolveType },
	MatchTwoPlayer: matchTwoPlayer,
	MatchFourPlayer: matchFourPlayer,
	MatchResults: matchResults,
	Message: message
};

export { typeDefs, resolvers };
