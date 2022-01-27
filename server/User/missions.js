import { checkIsMe } from "../utils.js";

const missions = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return context.db
		.collection("Missions")
		.find({ _id: { $in: parent.missions } })
		.toArray();
};

export default missions;
