import { UserInputError } from "apollo-server-express";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

import { generateAccessToken } from "../auth.js";
import { removeNullArgs } from "../db.js";

dotenv.config();

const loginUser = async (_, args, context, info) => {
	const { email, username, password } = args;
	const userRecord = await context.db
		.collection("Users")
		.findOne(removeNullArgs({ email, username }));
	const bytes = CryptoJS.AES.decrypt(userRecord.password, process.env.PASSWORD_KEY);
	const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
	if (!userRecord || decryptedPassword !== password) {
		throw new UserInputError("Incorrect Username or Password");
	}
	return generateAccessToken(userRecord._id.toString());
};

export default loginUser;
