import { UserInputError } from "apollo-server-errors";

import { ObjectId } from "mongodb";

import { checkIsLoggedIn } from "../utils.js";

const buyItem = async (_, args, context, info) => {
	await checkIsLoggedIn(context);

	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const itemRecord = await context.db.collection("Items").findOne({ _id: ObjectId(args.itemId) });

	if (itemRecord.type === "BATTLE_PASS" && userRecord.battlePass) {
		throw new UserInputError("Battle Pass Already Bought");
	} else if (userRecord.items.map((item) => item.toString()).includes(args.itemId)) {
		throw new UserInputError("Item Already Bought");
	}
	if (userRecord.money - itemRecord.cost < 0) {
		throw new UserInputError("User Does Not Have Enough Money");
	}

	let battlePass = null;

	if (itemRecord.type === "BATTLE_PASS") {
		battlePass = {
			items: [
				ObjectId("609845b9c150eec259ed0ce8"),
				ObjectId("60984623c150eec259ed0ce9"),
				ObjectId("60997fe125d7e84776a50575")
			],
			tiers: [1, 10, 100],
			cost: 10,
			totalXP: 0,
			currentTier: 0
		};
		battlePass._id = (
			await context.db.collection("BattlePass").insertOne(battlePass)
		).insertedId;
	}
	
	const modifiedUser = await context.db.collection("Users").findOneAndUpdate(
		{ _id: context.userId },
		{
			...(!battlePass && { $addToSet: { items: ObjectId(args.itemId) } }),
			$set: {
				money: userRecord.money - itemRecord.cost,
				...(!!battlePass && { battlePass: battlePass._id })
			}
		},
		{ returnDocument: 'after' }
	);

	return modifiedUser.value;
};

export default buyItem;
