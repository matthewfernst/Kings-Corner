import chai from "chai";

chai.should();

import players from "../../../server/Match/players.js";

describe("players.js", () => {
	describe("players", () => {
		it("should be a function", () => {
			players.should.be.a("function");
		});
	});
});
