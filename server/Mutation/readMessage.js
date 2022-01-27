import { ObjectId } from "mongodb";

import { checkIsLoggedIn } from "../utils.js";

const readMessage = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const modifiedMessage = await context.db
		.collection("Messages")
		.findOneAndUpdate(
			{ _id: ObjectId(args.messageId) },
			{ $addToSet: { readBy: userRecord.username } },
			{ returnDocument: "after" }
		);
	return modifiedMessage.value;
};

export default readMessage;
