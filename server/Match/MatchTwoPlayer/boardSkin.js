const boardSkin = (parent, args, context, info) => {
	return context.db.collection("Items").findOne({ _id: parent.boardSkin });
};

export default boardSkin;
