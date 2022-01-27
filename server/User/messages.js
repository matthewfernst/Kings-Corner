import { checkIsMe } from "../utils.js";

const messages = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Messages")
		.find({ _id: { $in: parent.messages } })
		.toArray();
};

export default messages;
