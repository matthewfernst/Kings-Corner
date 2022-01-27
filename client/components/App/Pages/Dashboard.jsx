import { Link, useNavigate } from "react-router-dom";

import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	Step,
	StepLabel,
	Stepper,
	Typography,
	useTheme
} from "@mui/material";
import { AvatarGroup, Skeleton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import RedeemIcon from "@mui/icons-material/Redeem";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import {
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";

import { useQuery, useMutation } from "@apollo/client";
import {
	GetStatisticsOverview,
	GetRankHistoryOverview,
	GetMatchesOverview,
	GetTopPlayers,
	GetBattlePassItems
} from "../../../graphql/query.js";
import { CreateMatch } from "../../../graphql/mutation.js";

import Chess from "chess.js";

const useStyles = makeStyles(() => ({
	hoverPaper: {
		cursor: "pointer",
		"&:hover": {
			boxShadow:
				"0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)"
		}
	}
}));

const DashBoard = (props) => {
	return (
		<Box height={"100%"} display={"flex"} flexDirection={"column"}>
			<Box pr={4} flexGrow={1} minHeight={300} height={300} className={"verticalScrollDiv"}>
				<Grid container spacing={4} style={{ height: "100%" }}>
					<PlayerStatistics />
					<YourRank />
					<TopPlayers />
					<Matches />
					<BattlePass />
				</Grid>
			</Box>
		</Box>
	);
};

const PlayerStatistics = (props) => {
	const classes = useStyles();
	const theme = useTheme();

	const { loading, error, data } = useQuery(GetStatisticsOverview);

	if (error) return null;
	if (loading)
		return (
			<Grid item xs style={{ minWidth: 300 }}>
				<Skeleton variant="rectangular" width={"100%"} height={"100%"} />
			</Grid>
		);

	if (data.selfLookup.playerStatistics.totalGames === 0) return null;

	const graphData = [
		{
			name: "Wins",
			value: data.selfLookup.playerStatistics.wins,
			color: theme.palette.primary.main
		},
		{
			name: "Losses",
			value: data.selfLookup.playerStatistics.losses,
			color: theme.palette.secondary.main
		},
		{
			name: "Stalemates",
			value: data.selfLookup.playerStatistics.stalemates,
			color: "#404040"
		}
	];

	return (
		<Grid item xs style={{ minWidth: 300 }}>
			<Link to={`/app/profile`} className={"no-line"}>
				<Paper className={classes.hoverPaper}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Player Statistics
					</Typography>
					<Divider />
					<Box style={{ padding: 15 }}>
						<ResponsiveContainer width={"100%"} height={200}>
							<PieChart>
								<Pie
									data={graphData}
									dataKey={"value"}
									nameKey={"name"}
									innerRadius={50}
								>
									{graphData.map((item, index) => (
										<Cell key={index} fill={item.color} />
									))}
								</Pie>
								<Tooltip />
								<Legend height={35} verticalAlign={"bottom"} />
							</PieChart>
						</ResponsiveContainer>
					</Box>
				</Paper>
			</Link>
		</Grid>
	);
};

const YourRank = (props) => {
	const classes = useStyles();
	const theme = useTheme();

	const { loading, error, data } = useQuery(GetRankHistoryOverview, {
		pollInterval: 10000
	});

	if (error) return null;
	if (loading)
		return (
			<Grid item xs style={{ minWidth: 550 }}>
				<Skeleton variant="rectangular" width={"100%"} height={"100%"} />
			</Grid>
		);

	if (!data.selfLookup.playerStatistics.ratingHistory) return null;

	const graphData = data.selfLookup.playerStatistics.ratingHistory.map((rating, index) => ({
		matchIndex: index,
		rating: rating
	}));

	return (
		<Grid item xs style={{ minWidth: 550 }}>
			<Link to={`/app/profile`} className={"no-line"}>
				<Paper className={classes.hoverPaper}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Rank Over Time
					</Typography>
					<Divider />
					<Box style={{ paddingTop: 20, paddingRight: 30, paddingBottom: 10 }}>
						<ResponsiveContainer width={"100%"} height={200}>
							<LineChart data={graphData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="matchIndex" hide />
								<YAxis />
								<Tooltip />
								<Line
									dataKey="rating"
									stroke={theme.palette.primary.main}
									strokeWidth={3}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Box>
				</Paper>
			</Link>
		</Grid>
	);
};

const TopPlayers = (props) => {
	const { loading, error, data } = useQuery(GetTopPlayers, {
		variables: { first: 5 },
		pollInterval: 10000
	});

	if (error) return null;
	if (loading)
		return (
			<Grid item xs style={{ minWidth: 350 }}>
				<Skeleton variant="rectangular" width={"100%"} height={"100%"} />
			</Grid>
		);

	const playerData = data.userTopRating.filter((player) => player.playerStatistics.rating);
	if (playerData.length === 0) return null;

	return (
		<Grid item xs style={{ minWidth: 350 }}>
			<Paper>
				<Typography
					variant={"h6"}
					style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
				>
					Top Players
				</Typography>
				<Divider />
				<Box p={1}>
					<List dense>
						{playerData.map((user, index) => (
							<ListItem key={index}>
								<ListItemAvatar>
									<Avatar src={user.avatar} key={index} />
								</ListItemAvatar>
								<ListItemText
									primary={user.username}
									secondary={`${user.playerStatistics.rating} Rating`}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Paper>
		</Grid>
	);
};

const Matches = (props) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const { loading, error, data } = useQuery(GetMatchesOverview, {
		pollInterval: 1000
	});

	const [createMatch] = useMutation(CreateMatch);

	if (error) return null;
	if (loading)
		return (
			<Grid item xs style={{ minWidth: 400 }}>
				<Skeleton variant="rectangular" width={"100%"} height={"100%"} />
			</Grid>
		);

	return (
		<Grid item xs style={{ minWidth: 400, maxWidth: 500 }}>
			<Paper
				style={{ height: "100%" }}
				className={classes.hoverPaper}
				onClick={() => navigate("/app/matches")}
			>
				<Box display={"flex"} flexDirection={"column"} height={"100%"}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Matches
					</Typography>
					<Divider />
					<Box p={1} flexGrow={1}>
						{data.selfLookup.matches.length > 0 ? (
							<List>
								{data.selfLookup.matches.map((match, index) => {
									const isTurn =
										match.inProgress &&
										new Chess(match.fen).turn() ===
											(match.whitePlayer === data.selfLookup.username
												? "b"
												: "w");
									return (
										<ListItem key={index}>
											<AvatarGroup max={2} style={{ paddingRight: 20 }}>
												{match.players.map((player, index) => (
													<Avatar src={player.avatar} key={index} />
												))}
											</AvatarGroup>
											<ListItemText
												primary={match.name || "Untitled Match"}
												secondary={
													isTurn === null
														? null
														: isTurn
														? "Your Turn"
														: "Opponent's Turn"
												}
											/>
											<ListItemSecondaryAction>
												<IconButton
													onClick={(e) => {
														e.stopPropagation();
														navigate("/app/matches/" + match._id);
													}}
												>
													<NavigateNextOutlinedIcon />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})}
							</List>
						) : (
							<Box
								p={3}
								display={"flex"}
								height={"100%"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Box pb={1}>
									<SportsEsportsIcon color={"primary"} style={{ fontSize: 28 }} />
								</Box>
								<Typography style={{ fontSize: 17, fontWeight: 500 }}>
									You don't have any matches!
								</Typography>
								<Box pt={2}>
									<Button onClick={() => createMatch()}>
										<Box p={1}>
											<Typography variant={"subtitle2"} color={"primary"}>
												Create One
											</Typography>
										</Box>
									</Button>
								</Box>
							</Box>
						)}
					</Box>
				</Box>
			</Paper>
		</Grid>
	);
};

const BattlePass = (props) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const { loading, error, data } = useQuery(GetBattlePassItems);
	if (loading || error) return null;

	if (!data.selfLookup.battlePass) {
		return (
			<Grid item xs style={{ minWidth: 400, minHeight: 400 }}>
				<Paper
					style={{ height: "100%" }}
					className={classes.hoverPaper}
					onClick={() => navigate("/app/shop")}
				>
					<Box display={"flex"} flexDirection={"column"} height={"100%"}>
						<Typography
							variant={"h6"}
							style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
						>
							Battle Pass
						</Typography>
						<Divider />
						<Box
							flexGrow={1}
							p={3}
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Box pb={1}>
								<RedeemIcon color={"primary"} style={{ fontSize: 28 }} />
							</Box>
							<Typography style={{ fontSize: 17, fontWeight: 500 }}>
								You don't have a Battle Pass!
							</Typography>
							<Box pt={2}>
								<Button>
									<Box p={1}>
										<Link to={`/app/shop`} className={"no-line"}>
											<Typography variant={"subtitle2"} color={"primary"}>
												PURCHASE ONE
											</Typography>
										</Link>
									</Box>
								</Button>
							</Box>
						</Box>
					</Box>
				</Paper>
			</Grid>
		);
	}

	const items = data.selfLookup.battlePass.items;
	const stepCount = data.selfLookup.battlePass.currentTier - 1;

	return (
		<Grid item xs style={{ minWidth: 600 }}>
			<Paper style={{ width: "100%", height: "100%" }}>
				<Grid container justifyContent={"space-between"} alignItems={"center"}>
					<Grid item>
						<Typography
							variant={"h6"}
							style={{ paddingTop: 18, paddingBottom: 12, paddingLeft: 25 }}
						>
							Battle Pass
						</Typography>
					</Grid>
				</Grid>
				<Divider />
				<Box p={4} flexGrow={1}>
					<Box height={"100%"} className={"horizontalScrollDiv"}>
						<Stepper
							alternativeLabel
							activeStep={stepCount}
							style={{ width: 300 * items.length }}
						>
							{items.map((item, index) => (
								<Step key={index}>
									<StepLabel>
										<Grid item key={index} style={{ marginTop: 50 }}>
											<img src={item.thumbnail} style={{ height: 145 }} />
										</Grid>
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Box>
				</Box>
			</Paper>
		</Grid>
	);
};

export default DashBoard;
