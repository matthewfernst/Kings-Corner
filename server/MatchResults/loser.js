const loser = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.loser });
};

export default loser;
