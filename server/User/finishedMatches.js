import { checkInMyFriends } from "../utils.js";

const finishedMatches = async (parent, args, context, info) => {
	await checkInMyFriends(context, parent.username);
	return context.db
		.collection("Matches")
		.find({ _id: { $in: parent.finishedMatches } })
		.toArray();
};

export default finishedMatches;
