const selfLookup = (_, args, context, info) => {
	if (!context.userId) return null;
	return context.db.collection("Users").findOne( context.userId );
};

export default selfLookup;