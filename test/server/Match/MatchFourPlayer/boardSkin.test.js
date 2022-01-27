import chai from "chai";

chai.should();

import boardSkin from "../../../../server/Match/MatchFourPlayer/boardSkin.js";

describe("boardSkin.js", () => {
	describe("boardSkin", () => {
		it("should be a function", () => {
			boardSkin.should.be.a("function");
		});
	});
});
