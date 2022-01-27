const whitePlayer = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.whitePlayer });
};

export default whitePlayer;
