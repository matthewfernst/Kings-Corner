import { Link } from "react-router-dom";

import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AvatarGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { useQuery, useMutation } from "@apollo/client";
import { GetMatchesOverview } from "../../../graphql/query.js";
import { CreateMatch } from "../../../graphql/mutation.js";

import Chess from "chess.js";

const useStyles = makeStyles((theme) => ({
	hoverPaper: {
		"&:hover": {
			boxShadow:
				"0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)"
		}
	}
}));

const Matches = () => {
	const { loading, error, data } = useQuery(GetMatchesOverview, {
		pollInterval: 1000
	});

	const [createMatch] = useMutation(CreateMatch);

	if (loading || error) return null;

	if (data.selfLookup.matches.length === 0) {
		return (
			<Grid
				container
				style={{ height: "100%" }}
				direction={"column"}
				spacing={4}
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Grid item>
					<Typography style={{ fontSize: 30, fontWeight: 500 }}>
						You don't have any matches!
					</Typography>
				</Grid>
				<Grid item>
					<Button
						size={"large"}
						variant={"contained"}
						color={"primary"}
						onClick={() => createMatch()}
					>
						<Typography variant={"subtitle2"}>Create One</Typography>
					</Button>
				</Grid>
			</Grid>
		);
	}
	return (
		<Box height={"100%"} display={"flex"} flexDirection={"column"}>
			<Box pr={4} flexGrow={1} height={500} className={"verticalScrollDiv"}>
				<Grid container spacing={4}>
					{data.selfLookup.matches.map((match, index) => (
						<Grid item key={index}>
							<MatchPaper match={match} username={data.selfLookup.username} />
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

const MatchPaper = (props) => {
	const classes = useStyles();
	return (
		<Link to={"/app/matches/" + props.match._id} className={"no-line"}>
			<Paper
				style={{ minWidth: 350, height: !props.match.inProgress ? undefined : 260 }}
				className={classes.hoverPaper}
			>
				{!props.match.inProgress ? (
					<MatchPaperPreGame {...props} />
				) : (
					<MatchPaperInGame {...props} />
				)}
			</Paper>
		</Link>
	);
};

const MatchPaperPreGame = (props) => {
	return (
		<Box p={3}>
			<Grid container spacing={2} justifyContent={"space-between"} alignItems={"center"}>
				<Grid item>
					<Typography style={{ fontSize: 18, fontWeight: 500 }}>
						{props.match.name || "Untitled Match"}
					</Typography>
				</Grid>
				<Grid item>
					<AvatarGroup max={2}>
						{props.match.players.map((player, index) => (
							<Avatar key={index} src={player.avatar} />
						))}
					</AvatarGroup>
				</Grid>
			</Grid>
		</Box>
	);
};

const MatchPaperInGame = (props) => {
	const chess = new Chess(props.match.fen);
	const playerColor = props.match.whitePlayer.username === props.username ? "w" : "b";
	const isTurn = chess.turn() === playerColor;

	const gameScore = calculateScore(props.match.fen);

	return (
		<Box p={3} display={"flex"} flexDirection={"column"}>
			<Box pb={3}>
				<Grid container spacing={8} justifyContent={"space-between"} alignItems={"center"}>
					<Grid item>
						<Typography style={{ fontSize: 18, fontWeight: 500 }}>
							{props.match.name || "Untitled Match"}
						</Typography>
						<Typography style={{ fontWeight: 500 }}>
							{isTurn
								? "Your Turn"
								: `${
										playerColor === "w"
											? props.match.blackPlayer.username
											: props.match.whitePlayer.username
								  }'s Turn`}
						</Typography>
					</Grid>
					<Grid item>
						<AvatarGroup max={2}>
							{props.match.players.map((player, index) => (
								<Avatar key={index} src={player.avatar} />
							))}
						</AvatarGroup>
					</Grid>
				</Grid>
			</Box>
			<Box flexGrow={1} display={"flex"} justifyContent={"space-between"}>
				<Box pr={6}>
					<Typography style={{ fontSize: 14 }}>
						Score: {gameScore[0]} pts - {gameScore[1]} pts
					</Typography>
				</Box>
				<Box width={135} height={135}>
					<MiniChessBoard fen={props.match.fen} playerColor={playerColor} />
				</Box>
			</Box>
		</Box>
	);
};

const calculateScore = (fen) => {
	let whiteScore = 0;
	let blackScore = 0;
	[...fen.split(" ")[0]].forEach((char) => {
		const isWhite = char == char.toUpperCase();
		let score = 0;
		switch (char.toLowerCase()) {
			case "p":
				score = 1;
				break;
			case "n":
			case "b":
				score = 3;
				break;
			case "r":
				score = 5;
				break;
			case "q":
				score = 9;
				break;
		}
		if (isWhite) whiteScore += score;
		else blackScore += score;
	});
	return [39 - whiteScore, 39 - blackScore];
};

const MiniChessBoard = (props) => {
	const chess = new Chess(props.fen);
	const board = props.playerColor === "w" ? chess.board() : chess.board().reverse();
	return (
		<Box width={"100%"} height={"100%"} boxShadow={4} position={"relative"}>
			<img
				style={{ width: "100%", height: "100%", position: "absolute" }}
				src={"https://kings-corner.games/images/2D/board/brown-checkerboard.svg"}
			/>
			<Box
				width={"100%"}
				height={"100%"}
				style={{ position: "absolute" }}
				display={"flex"}
				flexWrap={"wrap"}
			>
				{[].concat(...board).map((item, index) => (
					<MiniPiece
						key={index}
						row={Math.floor(index / 8)}
						col={index % 8}
						item={item}
					/>
				))}
			</Box>
		</Box>
	);
};

const MiniPiece = (props) => {
	const image = props.item && fenLetterToImage(props.item.type, props.item.color);
	return image ? (
		<Box
			width={"12.5%"}
			height={"12.5%"}
			position={"relative"}
			style={{ cursor: props.isTurn ? "move" : undefined, overflow: "visible" }}
		>
			<img style={{ width: "100%", height: "100%" }} src={image} />
		</Box>
	) : (
		<Box style={{ width: "12.5%", height: "12.5%" }} />
	);
};

const fenLetterToImage = (type, color) => {
	switch (type) {
		case "r":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-Rook.svg"
				: "https://kings-corner.games/images/2D/pieces/White-Rook.svg";
		case "n":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-Knight.svg"
				: "https://kings-corner.games/images/2D/pieces/White-Knight.svg";
		case "b":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-Bishop.svg"
				: "https://kings-corner.games/images/2D/pieces/White-Bishop.svg";
		case "q":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-Queen.svg"
				: "https://kings-corner.games/images/2D/pieces/White-Queen.svg";
		case "k":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-King.svg"
				: "https://kings-corner.games/images/2D/pieces/White-King.svg";
		case "p":
			return color === "b"
				? "https://kings-corner.games/images/2D/pieces/Black-Pawn.svg"
				: "https://kings-corner.games/images/2D/pieces/White-Pawn.svg";
		default:
			return null;
	}
};

export default Matches;
