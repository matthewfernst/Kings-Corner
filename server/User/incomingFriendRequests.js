import { checkIsMe } from "../utils.js";

const incomingFriendRequests = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.incomingFriendRequests } })
		.toArray();
};

export default incomingFriendRequests;
