import { ObjectId } from "mongodb";

import { checkIsLoggedIn, checkInMyFriends } from "../utils.js";

const inviteFriend = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	await checkInMyFriends(context, args.friendUsername);
	const match = await context.db
		.collection("Matches")
		.findOneAndUpdate(
			{ _id: ObjectId(args.matchId) },
			{ $addToSet: { pendingPlayers: args.friendUsername } },
			{ returnDocument: 'after' }
		);
	const friend = await context.db
		.collection("Users")
		.findOneAndUpdate(
			{ username: args.friendUsername },
			{ $addToSet: { matchInvites: ObjectId(args.matchId) } },
			{ returnDocument: 'after' }
		);
	context.pubsub.publish("NEW_MATCH_INVITE", {
		_id: friend.value._id,
		matchId: args.matchId
	});
	return match.value;
};

export default inviteFriend;
