const userTopRating = async (_, args, context, info) => {
	return context.db.collection("Users").find({}).sort({ rating: -1 }).limit(args.first).toArray();
};

export default userTopRating;
