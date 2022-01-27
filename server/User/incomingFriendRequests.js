import { checkIsMe } from "../utils.js";

const incomingFriendRequests = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.incomingFriendRequests } })
		.toArray();
};

export default incomingFriendRequests;
