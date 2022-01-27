const winner = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.winner });
};

export default winner;
