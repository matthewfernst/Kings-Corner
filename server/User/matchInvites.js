import { checkIsMe } from "../utils.js";

const matchInvites = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Matches")
		.find({ _id: { $in: parent.matchInvites } })
		.toArray();
};

export default matchInvites;
