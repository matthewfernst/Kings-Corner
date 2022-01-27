import { ObjectId } from "mongodb";

import { checkIsLoggedIn } from "../utils.js";

const createMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const newMatch = {
		matchOwner: userRecord.username,
		pendingPlayers: [],
		players: [userRecord.username],
		inProgress: false,
		boardSkin: ObjectId("6091973e685ad9a5076b5ac1"),
		pieceSkin: ObjectId("609197c0685ad9a5076b5ac2"),
		whitePlayer: userRecord.username,
		fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
		fenHistory: []
	};
	newMatch._id = (await context.db.collection("Matches").insertOne(newMatch)).insertedId;
	context.db
		.collection("Users")
		.updateOne({ _id: context.userId }, { $push: { matches: newMatch._id } });
	return newMatch;
};

export default createMatch;
