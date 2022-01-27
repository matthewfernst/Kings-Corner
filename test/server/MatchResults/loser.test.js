import chai from "chai";

chai.should();

import loser from "../../../server/MatchResults/loser.js";

describe("loser.js", () => {
	describe("loser", () => {
		it("should be a function", () => {
			loser.should.be.a("function");
		});
	});
});
