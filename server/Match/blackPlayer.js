const blackPlayer = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.blackPlayer });
};

export default blackPlayer;
