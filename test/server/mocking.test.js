import chai from "chai";

chai.should();

import mocks, { getRandomFenString } from "../../server/mocking.js";

describe("mocking.js", () => {
	describe("getRandomFenString", () => {
		it("should be a function", () => {
			getRandomFenString.should.be.a("function");
		});
		it("should return a string", () => {
			getRandomFenString(1).should.be.a("string");
		});
	});
	describe("mocks", () => {
		it("should be a object", () => {
			mocks.should.be.an("object");
		});
		it("should have User and Match properties", () => {
			mocks.should.have.property("User");
			mocks.should.have.property("Match");
		});
		it("should have scalar properties", () => {
			mocks.should.have.property("Fen");
			mocks.should.have.property("Rating");
		});
	});
});
