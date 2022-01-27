const pieceSkin = (parent, args, context, info) => {
	return context.db.collection("Items").findOne({ _id: parent.pieceSkin });
};

export default pieceSkin;
