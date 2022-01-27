import { ObjectId } from "mongodb";

const matchLookup = (_, args, context, info) => {
	return context.db.collection("Matches").findOne({ _id: ObjectId(args._id) });
};

export default matchLookup;