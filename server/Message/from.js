const from = (parent, args, context, info) => {
	return context.db.collection("Users").findOne({ username: parent.from });
};

export default from;