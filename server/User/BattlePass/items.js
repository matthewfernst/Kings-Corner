const items = (parent, args, context, info) => {
	return context.db
		.collection("Items")
		.find({ _id: { $in: parent.items } })
		.toArray();
};

export default items;
