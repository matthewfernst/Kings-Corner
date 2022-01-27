import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.should();
chai.use(chaiAsPromised);

import { AuthenticationError } from "apollo-server-express";

import { ObjectId } from "mongodb";
import casual from "casual";
import sinon from "sinon";

import {
	checkIsLoggedIn,
	checkIsMatchOwner,
	checkIsMe,
	checkInMyFriends,
	checkInTheirFriends
} from "../../server/utils.js";

describe("utils.js", () => {
	const fakeUserId = casual._id;
	const fakeTestId = "1234";
	const fakeUser = {
		_id: ObjectId(fakeUserId),
		matches: [fakeTestId]
	};
	const context = {
		userId: fakeUserId,
		db: { collection: () => ({ findOne: sinon.fake.returns(fakeUser) }) }
	};
	describe("checkIsLoggedIn", () => {
		it("should be a function", () => {
			checkIsLoggedIn.should.be.a("function");
		});
		it("should not throw an error if user is logged in and in database", () => {
			checkIsLoggedIn(context).should.eventually.not.throw(AuthenticationError);
		});
		it("should throw an error if userId is not provided", () => {
			const testContext = { ...context, userId: undefined };
			checkIsLoggedIn(testContext).should.eventually.throw(AuthenticationError);
		});
		it("should throw an error if user is not in the database", () => {
			const testContext = {
				...context,
				db: { collection: () => ({ findOne: sinon.fake.returns(null) }) }
			};
			checkIsLoggedIn(testContext).should.eventually.throw(AuthenticationError);
		});
	});
	describe("checkIsMatchOwner", () => {
		it("should be a function", () => {
			checkIsMatchOwner.should.be.a("function");
		});
	});
	describe("checkIsMe", () => {
		it("should be a function", () => {
			checkIsMe.should.be.a("function");
		});
		it("should not throw an error if requested user is the same as userId", () => {
			checkIsMe(fakeUser, context).should.eventually.not.throw(AuthenticationError);
		});
		it("should throw an error if userId is not provided", () => {
			const testContext = { ...context, userId: undefined };
			checkIsMe(fakeUser, testContext).should.eventually.throw(AuthenticationError);
		});
		it("should throw an error if requested user is not the same as userId", () => {
			const testContext = { ...context, userId: fakeTestId };
			checkIsMe(fakeUser, testContext).should.eventually.throw(AuthenticationError);
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
