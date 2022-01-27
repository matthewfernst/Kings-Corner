import { checkIsMe } from "../utils.js";

const outgoingFriendRequests = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.outgoingFriendRequests } })
		.toArray();
};

export default outgoingFriendRequests;
