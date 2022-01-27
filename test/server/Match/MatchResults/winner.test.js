import chai from "chai";

chai.should();

import winner from "../../../../server/Match/MatchResults/winner.js";

describe("winner.js", () => {
	describe("winner", () => {
		it("should be a function", () => {
			winner.should.be.a("function");
		});
	});
});
