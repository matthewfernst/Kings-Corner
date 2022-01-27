const pendingPlayers = (parent, args, context, info) => {
	return context.db
		.collection("Users")
		.find({ username: { $in: parent.pendingPlayers } })
		.toArray();
};

export default pendingPlayers;
