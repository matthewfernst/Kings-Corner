import { AuthenticationError, UserInputError } from "apollo-server-errors";

import * as mongodb from "mongodb";

const { ObjectId } = mongodb;

export const checkIsLoggedIn = async (context) => {
	if (!context.userId) {
		throw new AuthenticationError("Must Be Logged In");
	}
	if (!(await context.db.collection("Users").findOne(context.userId))) {
		throw new AuthenticationError("User Does Not Exist");
	}
};

export const checkIsMatchOwner = async (context, matchId) => {
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const matchRecord = await context.db.collection("Matches").findOne(ObjectId(matchId));
	return matchRecord.players[0] === userRecord.username;
};

export const checkIsMe = async (parent, context) => {
	if (!context.userId || parent._id.toString() !== context.userId.toString()) {
		throw new AuthenticationError("Permissions Invalid For Requested Field");
	}
};

export const checkInMyFriends = async (context, friendUsername) => {
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	if (userRecord.username !== friendUsername && !userRecord.friends.includes(friendUsername)) {
		throw new UserInputError("Not Friends With Provided User");
	}
};

export const checkInTheirFriends = async (parent, context) => {
	if (!context.userId) {
		throw new AuthenticationError("Permissions Invalid For Requested Field");
	}
	if (parent._id.toString() !== context.userId.toString()) {
		const userRecord = await context.db.collection("Users").findOne(context.userId);
		if (!parent.friends.map((friend) => friend.username).includes(userRecord.username)) {
			throw new AuthenticationError("Access Token Invalid For Fields Requested");
		}
	}
};
