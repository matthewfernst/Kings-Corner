import { ObjectId } from "mongodb";

import { checkIsLoggedIn } from "../utils.js";

const makeMove = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const oldMatch = await context.db.collection("Matches").findOne(ObjectId(args.matchId));
	const newMatch = await context.db.collection("Matches").findOneAndUpdate(
		{ _id: ObjectId(args.matchId) },
		{
			$push: { fenHistory: oldMatch.fen },
			$set: { fen: args.updatedFen }
		},
		{ returnDocument: "after" }
	);
	context.pubsub.publish("NEW_MATCH_MOVE", {
		_id: ObjectId(args.matchId),
		updatedFen: args.updatedFen
	});
	return newMatch.value;
};

export default makeMove;
