import { checkInMyFriends } from "../utils.js";

const matches = async (parent, args, context, info) => {
	await checkInMyFriends(context, parent.username);
	return context.db
		.collection("Matches")
		.find({ _id: { $in: parent.matches } })
		.toArray();
};

export default matches;
