import { checkIsMe } from "../utils.js";

const finishedMissions = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return parent.finishedMissions;
};

export default finishedMissions;
