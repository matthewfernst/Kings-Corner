const readBy = (parent, args, context, info) => {
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.readBy } })
		.toArray();
};

export default readBy;
