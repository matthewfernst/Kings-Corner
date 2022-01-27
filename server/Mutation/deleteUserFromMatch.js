import { UserInputError } from "apollo-server-errors";

import { ObjectId } from "mongodb";

import { checkIsLoggedIn, checkIsMatchOwner } from "../utils.js";

const deleteUserFromMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const isMatchOwner = await checkIsMatchOwner(context, args.matchId);
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const matchRecord = await context.db
		.collection("Matches")
		.findOne({ _id: ObjectId(args.matchId) });
	let match;
	if (!isMatchOwner) {
		match = await context.db.collection("Matches").findOneAndUpdate(
			{ _id: ObjectId(args.matchId) },
			{
				$pull: { players: userRecord.username },
				...(matchRecord.gameType === "TWO_PLAYER" && {
					$unset: { blackPlayer: "" }
				})
			},
			{ returnDocument: "after" }
		);
	} else {
		if (userRecord.username === args.friendUsername) {
			throw UserInputError("Use deleteMatch Mutation To Delete A Match");
		}
		match = await context.db.collection("Matches").findOneAndUpdate(
			{ _id: ObjectId(args.matchId) },
			{
				$pull: { players: args.friendUsername },
				...(matchRecord.gameType === "TWO_PLAYER" && {
					$unset: { blackPlayer: "" }
				})
			},
			{ returnDocument: "after" }
		);
	}
	context.pubsub.publish("DELETE_MATCH_PLAYER", {
		_id: ObjectId(args.matchId),
		friendUsername: isMatchOwner ? userRecord.username : args.friendUsername
	});
	return match.value;
};

export default deleteUserFromMatch;
