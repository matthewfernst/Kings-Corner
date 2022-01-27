import { useState } from "react";

import { Avatar, Box, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import ChessBoard from "./ChessBoard.jsx";

import Chess from "chess.js";
import { AvatarGroup } from "@mui/material";

const InGame = (props) => {
	const match = props.matchData.matchLookup;

	const chess = new Chess(match.fen);
	const playerColor =
		props.matchData.selfLookup.username === match.whitePlayer.username ? "w" : "b";
	const isTurn = chess.turn() === playerColor;

	const thumbnameUrlAsArray = match.boardSkin.thumbnail.split(".");
	const is3D = "png" === thumbnameUrlAsArray[thumbnameUrlAsArray.length - 1];

	return (
		<Box width={"100%"} height={"100%"} display={"flex"}>
			<Box
				flexGrow={1}
				pt={2}
				pl={2}
				mr={4}
				display={"flex"}
				flexDirection={"column"}
				sx={{ display: { xs: "none", md: "block" } }}
			>
				<MatchInformation match={match} playerColor={playerColor} isTurn={isTurn} />
				<MatchSettings {...props} />
			</Box>
			<Box p={2}>
				<ChessBoard
					matchId={props.matchId}
					match={match}
					playerColor={playerColor}
					isTurn={isTurn}
					makeMove={props.makeMove}
					resolveMatch={props.resolveMatch}
					is3D={is3D}
				/>
			</Box>
		</Box>
	);
};

const MatchInformation = (props) => {
	const chess = new Chess(props.match.fen);
	return (
		<Box style={{ minWidth: 300 }}>
			<Paper>
				<Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Match Information
					</Typography>
				</Box>
				<Divider />
				<Box p={3} display={"flex"} flexDirection={"column"}>
					{chess.game_over() && (
						<Box pb={2}>
							<Typography style={{ fontSize: 18 }}>Game Over!</Typography>
						</Box>
					)}
					<Box>
						<Typography style={{ fontSize: 18 }}>
							Turn: {props.isTurn ? "Your Turn" : "Opponent's Turn"}
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

const MatchSettings = (props) => {
	const [matchName, setMatchName] = useState(props.matchData.matchLookup.name);
	const [editingMatchName, setEditingMatchName] = useState(false);

	if (props.matchData.selfLookup.username !== props.matchData.matchLookup.matchOwner.username) {
		return null;
	}

	return (
		<Box mt={4} style={{ minWidth: 300 }}>
			<Paper>
				<Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Match Settings
					</Typography>
					<Box p={1} pr={2}>
						<AvatarGroup>
							{props.matchData.matchLookup.players.map((player, index) => (
								<Avatar key={index} src={player.avatar} />
							))}
						</AvatarGroup>
					</Box>
				</Box>
				<Divider />
				<Box p={3}>
					<Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
						{editingMatchName ? (
							<TextField
								fullWidth
								autoFocus
								variant={"standard"}
								label={"New Name"}
								value={matchName || ""}
								onChange={(e) => setMatchName(e.target.value)}
								error={!!matchName && matchName.length > 20}
								helperText={
									!!matchName && matchName.length > 20 && "Match Name Is Too Long"
								}
							/>
						) : (
							<Typography style={{ fontSize: 18, fontWeight: 500 }}>
								{matchName || "Untitled Match"}
							</Typography>
						)}
						<Box pl={1}>
							<IconButton
								onClick={() => {
									if (editingMatchName) {
										props.editMatch({
											variables: {
												matchId: props.matchId,
												name: matchName
											}
										});
									}
									setEditingMatchName(!editingMatchName);
								}}
								disabled={
									matchName instanceof String ||
									(!!matchName && matchName.length > 20)
								}
							>
								{editingMatchName ? <CheckIcon /> : <EditIcon />}
							</IconButton>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default InGame;
