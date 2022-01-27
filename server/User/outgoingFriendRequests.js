import { checkIsMe } from "../utils.js";

const outgoingFriendRequests = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.outgoingFriendRequests } })
		.toArray();
};

export default outgoingFriendRequests;
