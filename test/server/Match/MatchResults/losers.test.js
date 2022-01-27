import chai from "chai";

chai.should();

import losers from "../../../../server/Match/MatchResults/losers.js";

describe("losers.js", () => {
	describe("losers", () => {
		it("should be a function", () => {
			losers.should.be.a("function");
		});
	});
});
