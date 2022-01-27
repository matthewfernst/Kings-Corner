import { AuthenticationError } from "apollo-server-express";

import * as mongodb from "mongodb";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const { ObjectId } = mongodb;

dotenv.config();

export const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.AUTH_KEY);
};

export const decryptAccessToken = (token) => {
	return jwt.verify(token, process.env.AUTH_KEY);
};

export const authenticateHTTPAccessToken = (req) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return null;

	const token = authHeader.split(" ")[1];
	if (!token) throw new AuthenticationError("Authentication Token Not Specified");

	try {
		return ObjectId(decryptAccessToken(token).id);
	} catch (err) {
		throw new AuthenticationError("Invalid Authentication Token");
	}
};
