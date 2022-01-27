import { checkInMyFriends } from "../utils.js";

const friends = async (parent, args, context, info) => {
	await checkInMyFriends(context, parent.username);
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.friends } })
		.toArray();
};

export default friends;
