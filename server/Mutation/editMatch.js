import { UserInputError } from "apollo-server-errors";

import { ObjectId } from "mongodb";

import { checkIsLoggedIn, checkIsMatchOwner } from "../utils.js";
import { removeNullArgs } from "../db.js";

const editMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	if (!(await checkIsMatchOwner(context, args.matchId))) {
		throw new UserInputError("Must Be Match Owner For Mutation Request");
	}

	const nullArgs = removeNullArgs(args);
	if (nullArgs.boardSkin) {
		nullArgs.boardSkin = ObjectId(nullArgs.boardSkin);
	}
	if (nullArgs.pieceSkin) {
		nullArgs.pieceSkin = ObjectId(nullArgs.pieceSkin);
	}
	if (nullArgs.name) {
		if (nullArgs.name.length > 20) {
			throw new UserInputError("Match Name Longer Than 20 Characters");
		}
	}

	const modifiedMatch = await context.db
		.collection("Matches")
		.findOneAndUpdate(
			{ _id: ObjectId(args.matchId) },
			{ $set: nullArgs },
			{ returnDocument: "after" }
		);
	return modifiedMatch.value;
};

export default editMatch;
