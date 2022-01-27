import { checkIsMe } from "../utils.js";

const email = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return parent.email;
};

export default email;
