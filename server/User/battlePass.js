import { checkIsMe } from "../utils.js";

const battlePass = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	return await context.db.collection("BattlePass").findOne({ _id: parent.battlePass });
};

export default battlePass;
