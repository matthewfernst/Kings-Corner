import { checkIsLoggedIn } from "../utils.js";

const requestFriend = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const userRecord = await context.db
		.collection("Users")
		.findOneAndUpdate(
			{ _id: context.userId },
			{ $addToSet: { outgoingFriendRequests: args.friendUsername } },
			{ returnDocument: 'after' }
		);
	const friend = await context.db
		.collection("Users")
		.findOneAndUpdate(
			{ username: args.friendUsername },
			{ $addToSet: { incomingFriendRequests: userRecord.value.username } },
			{ returnDocument: 'after' }
		);
	context.pubsub.publish("NEW_FRIEND_REQUEST", {
		_id: friend.value._id,
		friendUsername: userRecord.value.username
	});
	return userRecord.value;
};

export default requestFriend;