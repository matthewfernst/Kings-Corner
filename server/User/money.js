import { checkIsMe } from "../utils.js";

const money = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return parent.money;
};

export default money;
