import chai from "chai";

chai.should();

import blackPlayer from "../../../server/Match/blackPlayer.js";

describe("blackPlayer.js", () => {
	describe("blackPlayer", () => {
		it("should be a function", () => {
			blackPlayer.should.be.a("function");
		});
	});
});
