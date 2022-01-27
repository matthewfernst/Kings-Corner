import { UserInputError } from "apollo-server-errors";

import { checkIsLoggedIn } from "../utils.js";

const sendMessage = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	if (!userRecord.friends.includes(args.friendUsername)) {
		throw new UserInputError("Not Friends With Provided User");
	}
	const message = {
		date: DateTime.now().toMillis(),
		message: args.message,
		to: args.friendUsername,
		from: userRecord.username,
		readBy: [userRecord.username]
	};
	message._id = (await context.db.collection("Messages").insertOne(message)).insertedId;
	await context.db
		.collection("Users")
		.updateOne({ username: userRecord.username }, { $addToSet: { messages: message._id } });
	const modifiedUser = await context.db
		.collection("Users")
		.findOneAndUpdate(
			{ username: args.friendUsername },
			{ $addToSet: { messages: message._id } },
			{ returnDocument: "after" }
		);
	context.pubsub.publish("NEW_MESSAGE", {
		_id: modifiedUser.value._id,
		message: message
	});
	return message;
};

export default sendMessage;
