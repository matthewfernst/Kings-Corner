import chai from "chai";

chai.should();

import pieceSkin from "../../../../server/Match/MatchTwoPlayer/pieceSkin.js";

describe("pieceSkin.js", () => {
	describe("pieceSkin", () => {
		it("should be a function", () => {
			pieceSkin.should.be.a("function");
		});
	});
});
