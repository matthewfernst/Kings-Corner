import chai from "chai";

chai.should();

import matchOwner from "../../../../server/Match/MatchFourPlayer/matchOwner.js";

describe("matchOwner.js", () => {
	describe("matchOwner", () => {
		it("should be a function", () => {
			matchOwner.should.be.a("function");
		});
	});
});
