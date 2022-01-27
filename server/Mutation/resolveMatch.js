import { UserInputError } from "apollo-server-errors";
import { ObjectId } from "mongodb";

import { Chess } from "chess.js";

import { checkIsLoggedIn } from "../utils.js";

const resolveMatch = async (_, args, context, info) => {
	await checkIsLoggedIn(context);
	const chess = new Chess(args.finalFen);
	if (!chess.game_over()) {
		new UserInputError("Game Not In Finished State");
	}
	const gameResult = getGameResult(chess);
	const userRecord = await context.db.collection("Users").findOne(context.userId);
	const oldMatch = await context.db
		.collection("Matches")
		.findOne({ _id: ObjectId(args.matchId) });

	const playerRatings = await updateAndGetPlayerRatings(context, oldMatch, gameResult);

	playerRatings.forEach(async ({ username, rating }) => {
		const playerRecord = await updatePlayerStatistics(
			context,
			gameResult,
			username,
			rating,
			userRecord
		);

		if (playerRecord.value.battlePass) {
			await handleMissions(context, playerRecord, username);
		}
	});

	const newMatch = await updateMatchToFinished(
		args,
		context,
		oldMatch,
		gameResult,
		userRecord,
		playerRatings
	);

	context.pubsub.publish("NEW_MATCH_MOVE", {
		_id: ObjectId(args.matchId),
		updatedFen: args.finalFen
	});

	return newMatch.value;
};

const getGameResult = (chess) => {
	if (chess.in_checkmate()) return "win";
	if (chess.in_draw() || chess.in_stalemate()) return "draw";
};

const calculateRating = (playerRating, opponentsRating, win) => {
	return (
		playerRating +
		16 *
			(win
				? 1
				: 0 -
				  ((win ? 0 : 1) +
						(1 / 400) *
							opponentsRating
								.map((opponentRating) => opponentRating - playerRating)
								.reduce((accumulator, element) => accumulator + element)))
	);
};

const updatePlayerStatistics = async (context, gameResult, username, rating, userRecord) => {
	return await context.db.collection("Users").findOneAndUpdate(
		{ username },
		{
			$set: {
				"playerStatistics.rating": rating
			},
			$inc: {
				money: 1,
				"playerStatistics.totalGames": 1,
				"playerStatistics.wins":
					gameResult === "win" && username === userRecord.username ? 1 : 0,
				"playerStatistics.losses":
					gameResult === "win" && username !== userRecord.username ? 1 : 0,
				"playerStatistics.stalemates": gameResult === "draw" ? 1 : 0
			}
		},
		{ returnDocument: "after" }
	);
};

const updateAndGetPlayerRatings = async (context, oldMatch, gameResult) => {
	return await Promise.all(
		oldMatch.players.map(async (player) => {
			const playerRecord = await context.db.collection("Users").findOne({ username: player });
			const opponents = oldMatch.players.filter(
				(possibleOpponent) => possibleOpponent !== player
			);
			const opponentRatings = await Promise.all(
				opponents.map(async (opponent) => {
					const opponentRecord = await context.db
						.collection("Users")
						.findOne({ username: opponent });
					return opponentRecord.playerStatistics.rating;
				})
			);

			const playerNewRating = calculateRating(
				playerRecord.playerStatistics.rating || 1200,
				opponentRatings,
				gameResult === "win" && player === playerRecord.username
			);

			return { username: player, rating: playerNewRating };
		})
	);
};

const handleMissions = async (context, playerRecord, username) => {
	playerRecord.value.missions.forEach(async (_id) => {
		const mission = await findMission(context, _id);

		if (mission.value.threshold === mission.value.progress) {
			const battlePass = await updateBattlePassXP(context, playerRecord, mission);

			await deleteCompleteMissions(context, playerRecord, _id);

			if (battlePass.value.totalXP >= battlePass.value.tiers[battlePass.value.currentTier]) {
				await updateBattlePassItemsAndTier(context, battlePass, playerRecord, username);
			}
		}
	});
};

const findMission = async (context, _id) => {
	return await context.db.collection("Missions").findOneAndUpdate(
		{ _id },
		{
			$inc: {
				progress: 1
			}
		},
		{ returnDocument: "after" }
	);
};

const updateBattlePassXP = async (context, playerRecord, mission) => {
	return await context.db.collection("BattlePass").findOneAndUpdate(
		{ _id: playerRecord.value.battlePass },
		{
			$inc: {
				totalXP: mission.value.gainedXP
			}
		},
		{ returnDocument: "after" }
	);
};

const deleteCompleteMissions = async (context, playerRecord, _id) => {
	await context.db.collection("Missions").deleteOne({ _id });
	await context.db.collection("Users").updateOne(
		{ id: playerRecord.username },
		{
			$pull: { missions: _id }
		}
	);
};

const updateBattlePassItemsAndTier = async (context, battlePass, playerRecord, username) => {
	await context.db.collection("Users").updateOne(
		{ username },
		{
			$addToSet: {
				items: battlePass.value.items[battlePass.value.currentTier]
			}
		}
	);

	await context.db.collection("BattlePass").updateOne(
		{ _id: playerRecord.value.battlePass },
		{
			$inc: {
				currentTier: 1
			}
		}
	);
};

const updateMatchToFinished = async (
	args,
	context,
	oldMatch,
	gameResult,
	userRecord,
	playerRatings
) => {
	return await context.db.collection("Matches").findOneAndUpdate(
		{ _id: ObjectId(args.matchId) },
		{
			$push: { fenHistory: oldMatch.fen },
			$set: {
				inProgress: false,
				fen: args.finalFen,
				matchResults: {
					winner: gameResult === "win" && userRecord.username,
					winnerNewRating:
						gameResult === "win" &&
						playerRatings.filter(({ username }) => username === userRecord.username)[0]
							.rating,
					losersNewRating: playerRatings
						.filter(({ username }) => username !== userRecord.username)
						.map((player) => player.rating)
				}
			}
		},
		{ returnDocument: "after" }
	);
};

export default resolveMatch;
