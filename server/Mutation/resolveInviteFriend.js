import { UserInputError } from "apollo-server-errors";
import { ObjectId } from "mongodb";

import { checkIsLoggedIn } from "../utils.js";

const resolveInviteFriend = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const matchRecord = await context.db.collection("Matches").findOne(ObjectId(args.matchId));
	if (getNumberOfPlayers(matchRecord) === matchRecord.players.length) {
		throw new UserInputError("Match Is Already Full");
	}
	const userRecord = await context.db.collection("Users").findOneAndUpdate(
		{ _id: context.userId },
		{
			...(args.choice && { $addToSet: { matches: ObjectId(args.matchId) } }),
			$pull: { matchInvites: ObjectId(args.matchId) }
		},
		{ returnDocument: "after" }
	);
	let match;
	if (args.choice) {
		const matchRecord = await context.db.collection("Matches").findOne(ObjectId(args.matchId));
		match = await context.db.collection("Matches").findOneAndUpdate(
			{ _id: ObjectId(args.matchId), players: { $ne: userRecord.value.username } },
			{
				$pull: { pendingPlayers: userRecord.value.username },
				$push: { players: userRecord.value.username },
				...(matchRecord.gameType === "TWO_PLAYER" && {
					$set: { blackPlayer: userRecord.value.username }
				})
			},
			{ returnDocument: "after" }
		);
	} else {
		match = await context.db.collection("Matches").findOne(ObjectId(args.matchId));
	}
	context.pubsub.publish("NEW_MATCH_PLAYER", {
		_id: ObjectId(args.matchId),
		newPlayer: userRecord.value.username
	});
	return match.value;
};

const getNumberOfPlayers = (match) => {
	switch (match.gameType) {
		case "TWO_PLAYER":
			return 2;
		case "FOUR_PLAYER":
			return 4;
	}
};

export default resolveInviteFriend;
