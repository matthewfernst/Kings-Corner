import { checkInMyFriends } from "../utils.js";

const name = async (parent, args, context, info) => {
	await checkInMyFriends(context, parent.username);
	return parent.name;
};

export default name;
