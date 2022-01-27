import { checkIsMe } from "../utils.js";

const missions = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return context.db
		.collection("Missions")
		.find({ _id: { $in: parent.missions } })
		.toArray();
};

export default missions;
