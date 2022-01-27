import { checkIsMe } from "../utils.js";

const messages = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Messages")
		.find({ _id: { $in: parent.messages } })
		.toArray();
};

export default messages;
