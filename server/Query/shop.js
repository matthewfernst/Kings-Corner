const shop = async (_, args, context, info) => {
	return {
		items: await context.db.collection("Items").find({}).toArray(),
		battlePass: null
	};
};

export default shop;