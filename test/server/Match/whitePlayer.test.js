import chai from "chai";

chai.should();

import whitePlayer from "../../../server/Match/whitePlayer.js";

describe("whitePlayer.js", () => {
	describe("whitePlayer", () => {
		it("should be a function", () => {
			whitePlayer.should.be.a("function");
		});
	});
});
