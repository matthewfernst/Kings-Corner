const matchOwner = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.matchOwner });
};

export default matchOwner;
