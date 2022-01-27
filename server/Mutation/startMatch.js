import { UserInputError } from "apollo-server-errors";
import { ObjectId } from "mongodb";

import { checkIsLoggedIn, checkIsMatchOwner } from "../utils.js";

const startMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	if (!(await checkIsMatchOwner(context, args.matchId))) {
		throw new UserInputError("Must Be Match Owner For Mutation Request");
	}
	const newMatch = await context.db.collection("Matches").findOneAndUpdate(
		{ _id: ObjectId(args.matchId) },
		{
			$set: { inProgress: true }
		},
		{ returnDocument: "after" }
	);
	context.pubsub.publish("NEW_MATCH_IN_PROGRESS", {
		_id: ObjectId(args.matchId),
		inProgress: true
	});
	return newMatch.value;
};

export default startMatch;
