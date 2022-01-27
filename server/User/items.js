import { checkIsMe } from "../utils.js";

const items = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Items")
		.find({ _id: { $in: parent.items } })
		.toArray();
};

export default items;
