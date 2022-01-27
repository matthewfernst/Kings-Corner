const to = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.to });
};

export default to;