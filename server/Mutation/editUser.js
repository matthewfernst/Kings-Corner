import CryptoJS from "crypto-js";

import { UserInputError } from "apollo-server-errors";
import dotenv from "dotenv";

import { checkIsLoggedIn } from "../utils.js";
import { removeNullArgs } from "../db.js";

dotenv.config();

const editUser = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const nullArgs = removeNullArgs(args);
	if (nullArgs.email) {
		const userRecord = await context.db.collection("Users").findOne({ email: nullArgs.email });
		if (userRecord) {
			throw new UserInputError("User Already Exists");
		}
	}
	if (nullArgs.username) {
		if (nullArgs.username.length > 12) {
			throw new UserInputError("Username Longer Than 12 Characters");
		}
		const userRecord = await context.db
			.collection("Users")
			.findOne({ username: args.username });
		if (userRecord) {
			throw new UserInputError("User Already Exists");
		}
	}
	if (nullArgs.password) {
		nullArgs.password = CryptoJS.AES.encrypt(
			nullArgs.password,
			process.env.PASSWORD_KEY
		).toString();
	}
	const modifiedUser = await context.db
		.collection("Users")
		.findOneAndUpdate(
			{ _id: context.userId },
			{ $set: nullArgs },
			{ returnDocument: 'after' }
		);
	return modifiedUser.value;
};

export default editUser;
