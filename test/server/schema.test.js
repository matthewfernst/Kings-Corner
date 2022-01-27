import chai from "chai";

chai.should();

import { typeDefs, resolvers } from "../../server/schema.js";

describe("schema.js", () => {
	describe("typeDefs", () => {
		it("should be an object", () => {
			typeDefs.should.be.an("object");
		});
	});
	describe("resolvers", () => {
		it("should be an object", () => {
			resolvers.should.be.an("object");
		});
		it("should have Query, Mutation, and Subscription properties", () => {
			resolvers.should.have.property("Query");
			resolvers.should.have.property("Mutation");
			resolvers.should.have.property("Subscription");
		});
		it("should have other properties", () => {
			resolvers.should.have.property("User");
			resolvers.should.have.property("PlayerStatistics");
			resolvers.should.have.property("BattlePass");
			resolvers.should.have.property("Match");
			resolvers.should.have.property("MatchTwoPlayer");
			resolvers.should.have.property("MatchFourPlayer");
			resolvers.should.have.property("MatchResults");
			resolvers.should.have.property("Message");
		});
	});
});
