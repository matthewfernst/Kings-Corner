const losers = (parent, args, context, info) => {
	return context.db.collection("Users").find({ username: { $in: parent.loser } });
};

export default losers;
