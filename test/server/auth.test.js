import chai from "chai";

const should = chai.should();

import { AuthenticationError } from "apollo-server-express";
import casual from "casual";
import { ObjectId } from "mongodb";

import {
	generateAccessToken,
	decryptAccessToken,
	authenticateHTTPAccessToken
} from "../../server/auth.js";

describe("auth.js", () => {
	describe("generateAccessToken", () => {
		it("should be a function", () => {
			generateAccessToken.should.be.a("function");
		});
		it("should return a string", () => {
			generateAccessToken({ id: "test" }).should.be.a("string");
		});
	});
	describe("decryptAccessToken", () => {
		it("should be a function", () => {
			decryptAccessToken.should.be.a("function");
		});
		it("should throw an error if given a bad token", () => {
			const accessToken = "hello world";
			(() => decryptAccessToken(accessToken)).should.throw();
		});
		it("should decrypt a token generated by 'generateAccessToken'", () => {
			const id = casual.array_of_digits(24).join("");
			const accessToken = generateAccessToken(id);
			decryptAccessToken(accessToken).should.include({ id });
		});
	});
	describe("authenticateHTTPAccessToken", () => {
		it("should be a function", () => {
			authenticateHTTPAccessToken.should.be.a("function");
		});
		it("should return null if authorization header is not provided", () => {
			const req = { headers: {} };
			should.not.exist(authenticateHTTPAccessToken(req));
		});
		it("should throw an AuthenticationError if token is not provided", () => {
			const req = { headers: { authorization: "Bearer " } };
			(() => authenticateHTTPAccessToken(req)).should.throw(AuthenticationError);
		});
		it("should throw an AuthenticationError if token is not good", () => {
			const req = { headers: { authorization: "Bearer test" } };
			(() => authenticateHTTPAccessToken(req)).should.throw(AuthenticationError);
		});
		it("should return the id if given a token from 'generateAccessToken'", () => {
			const id = casual.array_of_digits(24).join("");
			const token = generateAccessToken(id);
			const req = { headers: { authorization: `Bearer ${token}` } };
			authenticateHTTPAccessToken(req).should.deep.equal(ObjectId(id));
		});
	});
});