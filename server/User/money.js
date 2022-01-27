import { checkIsMe } from "../utils.js";

const money = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return parent.money;
};

export default money;
