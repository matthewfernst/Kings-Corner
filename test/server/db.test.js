import chai from "chai";

chai.should();

import { client, removeNullArgs } from "../../server/db.js";

describe("db.js", () => {
	describe("client", () => {
		it("should be a object", () => {
			client.should.be.an("object");
		});
	});
	describe("removeNullArgs", () => {
		it("should be a function", () => {
			removeNullArgs.should.be.a("function");
		});
		it("should do nothing to regular object", () => {
			const testObject = { foo: "bar", hello: "world" };
			removeNullArgs(testObject).should.deep.equal(testObject);
		});
		it("should remove keys with null values", () => {
			const testObject = { foo: "bar", hello: null };
			removeNullArgs(testObject).should.deep.equal({ foo: "bar" });
		});
	});
});
