import { checkIsMe } from "../utils.js";

const items = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Items")
		.find({ _id: { $in: parent.items } })
		.toArray();
};

export default items;
