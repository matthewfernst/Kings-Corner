import { checkIsMe } from "../utils.js";

const finishedMissions = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return parent.finishedMissions;
};

export default finishedMissions;
