import { UserInputError } from "apollo-server-errors";

import { ObjectId } from "mongodb";

import { checkIsLoggedIn, checkIsMatchOwner } from "../utils.js";

const deleteMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	if (!(await checkIsMatchOwner(context, args.matchId))) {
		throw new UserInputError("Must Be Match Owner For Mutation Request");
	}
	await context.db.collection("Matches").deleteOne({ _id: ObjectId(args.matchId) });
	context.pubsub.publish("DELETED_MATCH", {
		matchId: args.matchId
	});
	return true;
};

export default deleteMatch;
