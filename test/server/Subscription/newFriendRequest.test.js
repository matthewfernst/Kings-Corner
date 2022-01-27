import chai from "chai";

chai.should();

import { ObjectId } from "mongodb";
import casual from "casual";
import sinon from "sinon";

import newFriendRequest from "../../../server/Subscription/newFriendRequest";

describe("Subscription/newFriendRequest", () => {
	describe("newFriendRequest", () => {
		it("should be an object", () => {
			newFriendRequest.should.be.an("object");
		});
		it("should be a resolve and subscribe properties", () => {
			newFriendRequest.should.have.property("resolve");
			newFriendRequest.should.have.property("subscribe");
		});
	});
	describe("resolve", () => {
		it("should be a function", () => {
			newFriendRequest.resolve.should.be.a("function");
		});
		it("should return the friendUsername field of its parent", () => {
			const testUsername = casual.username;
			newFriendRequest
				.resolve({ friendUsername: testUsername }, {}, {}, {})
				.should.equal(testUsername);
		});
	});
	describe("subscribe", () => {
		it("should be a function", () => {
			newFriendRequest.subscribe.should.be.a("function");
		});
	});
});
