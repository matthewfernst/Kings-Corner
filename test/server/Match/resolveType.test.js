import chai from "chai";

const should = chai.should();

import __resolveType from "../../../server/Match/resolveType.js";

describe("resolveType.js", () => {
	describe("__resolveType", () => {
		it("should be a function", () => {
			__resolveType.should.be.a("function");
		});
        it("should return MatchTwoPlayer if gameType is TWO_PLAYER", () => {
			__resolveType({ gameType: "TWO_PLAYER" }).should.equal("MatchTwoPlayer");
		});
        it("should return MatchFourPlayer if gameType is FOUR_PLAYER", () => {
			__resolveType({ gameType: "FOUR_PLAYER" }).should.equal("MatchFourPlayer");
		});
        it("should return null if gameType is GARBAGE", () => {
			should.not.exist(__resolveType({ gameType: "GARBAGE" }));
		});
	});
});
