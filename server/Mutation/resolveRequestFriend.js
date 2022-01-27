import { checkIsLoggedIn } from "../utils.js";

const resolveRequestFriend = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const userRecord = await context.db.collection("Users").findOneAndUpdate(
		{ _id: context.userId },
		{
			$pull: { incomingFriendRequests: args.friendUsername },
			...(args.choice && { $addToSet: { friends: args.friendUsername } })
		},
		{ returnDocument: 'after' }
	);
	const friend = await context.db.collection("Users").findOneAndUpdate(
		{ username: args.friendUsername },
		{
			$pull: { outgoingFriendRequests: userRecord.value.username },
			...(args.choice && { $addToSet: { friends: userRecord.value.username } })
		},
		{ returnDocument: 'after' }
	);
	context.pubsub.publish("NEW_FRIEND", {
		_id: friend.value._id,
		friendUsername: userRecord.value.username
	});
	return userRecord.value;
};

export default resolveRequestFriend;
