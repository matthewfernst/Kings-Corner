import { checkIsMe } from "../utils.js";

const matchInvites = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Matches")
		.find({ _id: { $in: parent.matchInvites } })
		.toArray();
};

export default matchInvites;
