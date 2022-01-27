import { checkIsMe } from "../utils.js";

const email = (parent, args, context, info) => {
	checkIsMe(parent, context);
	return parent.email;
};

export default email;
