import chai from "chai";

chai.should();

import pendingPlayers from "../../../server/Match/pendingPlayers.js";

describe("pendingPlayers.js", () => {
	describe("pendingPlayers", () => {
		it("should be a function", () => {
			pendingPlayers.should.be.a("function");
		});
	});
});
