import { removeNullArgs } from "../db.js";

const userLookup = (_, args, context, info) => {
	return context.db.collection("Users").findOne(removeNullArgs(args));
};

export default userLookup;