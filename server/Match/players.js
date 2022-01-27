const players = (parent, args, context, info) => {
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.players } })
		.toArray();
};

export default players;
