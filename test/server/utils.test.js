import chai from "chai";

chai.should();

import { AuthenticationError } from "apollo-server-express";

import {
	checkIsLoggedIn,
	checkIsMatchOwner,
	checkIsMe,
	checkInMyFriends,
	checkInTheirFriends
} from "../../server/utils.js";

describe("utils.js", () => {
	describe("checkIsLoggedIn", () => {
		it("should be a function", () => {
			checkIsLoggedIn.should.be.a("function");
		});
	});
	describe("checkIsMatchOwner", () => {
		it("should be a function", () => {
			checkIsMatchOwner.should.be.a("function");
		});
	});
	describe("checkIsMe", () => {
		const context = { userId: "1234" };
		it("should be a function", () => {
			checkIsMe.should.be.a("function");
		});
		it("should throw an error if userId is not in context", () => {
			const parent = { _id: "1234" };
			(() => checkIsMe(parent, {})).should.throw(AuthenticationError);
		});
		it("should do nothing if userId matches found user", () => {
			const parent = { _id: "1234" };
			(() => checkIsMe(parent, context)).should.not.throw(AuthenticationError);
		});
		it("should throw an error if userId does not match found user", () => {
			const parent = { _id: "12345" };
			(() => checkIsMe(parent, context)).should.throw(AuthenticationError);
		});
	});
	describe("checkInMyFriends", () => {
		it("should be a function", () => {
			checkInMyFriends.should.be.a("function");
		});
	});
	describe("checkInTheirFriends", () => {
		it("should be a function", () => {
			checkInTheirFriends.should.be.a("function");
		});
	});
});
