import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.should();
chai.use(chaiAsPromised);

import { ObjectId } from "mongodb";
import casual from "casual";

import email from "../../../server/User/email";

describe("User/email", () => {
	const fakeUserId = casual._id;
	const fakeEmail = casual.email;
	const fakeUser = { _id: ObjectId(fakeUserId), email: fakeEmail };
	describe("email", () => {
		it("should be a function", () => {
			email.should.be.a("function");
		});
		it("should return the user email", () => {
			email(fakeUser, {}, { userId: fakeUserId }, {}).should.eventually.equal(fakeEmail);
		});
	});
});
