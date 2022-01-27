import { useState, useEffect } from "react";

import {
	Avatar,
	Button,
	Box,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	Radio,
	Typography,
	TextField
} from "@mui/material";
import { Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";

import { useQuery, useMutation } from "@apollo/client";
import { GetFriends, GetOwnedItems } from "../../../graphql/query.js";
import { InviteFriend } from "../../../graphql/mutation.js";
import { NewFriend } from "../../../graphql/subscription.js";

const useStyles = makeStyles((theme) => ({
	bigAvatar: {
		width: theme.spacing(12),
		height: theme.spacing(12)
	}
}));

const PreGame = (props) => {
	const getLobbyType = () => {
		switch (props.matchData.matchLookup.__typename) {
			case "MatchTwoPlayer":
				return <LobbyTwoPlayer {...props} />;
			case "MatchFourPlayer":
				return <LobbyFourPlayer {...props} />;
		}
	};

	return (
		<Box pr={4} minHeight={"100%"} height={250} className={"verticalScrollDiv"}>
			<Grid container spacing={4}>
				{getLobbyType()}
				<InviteFriends {...props} />
				<MatchSettings {...props} />
				<SkinSelection {...props} />
			</Grid>
		</Box>
	);
};

const LobbyTwoPlayer = (props) => {
	const classes = useStyles();
	const [removePlayerButtonTimer, setRemovePlayerButtonTimer] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setRemovePlayerButtonTimer((removePlayerButtonTimer) => {
				if (removePlayerButtonTimer === 0) return removePlayerButtonTimer;
				return removePlayerButtonTimer - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<Grid item xs={12}>
			<Box style={{ width: "100%" }}>
				<Paper style={{ width: "100%" }}>
					<Box
						display={"flex"}
						justifyContent={"space-between"}
						alignItems={"center"}
						className={"verticalScrollDiv"}
					>
						<Typography
							variant={"h6"}
							style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
						>
							Lobby
						</Typography>
						{props.matchData.selfLookup.username ===
							props.matchData.matchLookup.matchOwner.username && (
							<Box pr={2} display={"flex"} alignItems={"center"}>
								<Box pr={2}>
									<IconButton
										onClick={() =>
											props.deleteMatch({
												variables: { matchId: props.matchId }
											})
										}
									>
										<DeleteIcon />
									</IconButton>
								</Box>
								<Button
									size={"small"}
									variant={"contained"}
									color={"primary"}
									disabled={props.matchData.matchLookup.players.length !== 2}
									onClick={() =>
										props.startMatch({ variables: { matchId: props.matchId } })
									}
								>
									Start Match
								</Button>
							</Box>
						)}
					</Box>
					<Divider />
					<Box
						p={3}
						display={"flex"}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Box display={"flex"} alignItems={"flex-start"}>
							<Box pr={2}>
								<Avatar
									src={props.matchData.matchLookup.whitePlayer.avatar}
									className={classes.bigAvatar}
								/>
							</Box>
							<Typography style={{ fontSize: 20, fontWeight: 500 }}>
								{props.matchData.matchLookup.whitePlayer.username}
							</Typography>
						</Box>
						<Typography style={{ fontSize: 30, fontWeight: 500 }}>vs</Typography>
						<Box display={"flex"} alignItems={"flex-end"}>
							<Typography style={{ fontSize: 20, fontWeight: 500 }}>
								{props.matchData.matchLookup.players.length === 1
									? "Unknown Player"
									: props.matchData.matchLookup.blackPlayer.username}
							</Typography>
							<Box pl={2}>
								{props.matchData.matchLookup.players.length === 1 ? (
									<Skeleton variant="circular" width={96} height={96} />
								) : (
									<Box
										position={"relative"}
										onMouseOver={() => setRemovePlayerButtonTimer(8)}
									>
										<Avatar
											src={props.matchData.matchLookup.blackPlayer.avatar}
											className={classes.bigAvatar}
										/>
										{removePlayerButtonTimer !== 0 && (
											<Box
												position={"absolute"}
												style={{ top: 0, right: 0 }}
												width={25}
												height={25}
												bgcolor={"primary.main"}
												borderRadius={"100%"}
												onClick={() =>
													props.deleteUserFromMatch({
														variables: {
															matchId: props.matchId,
															friendUsername:
																props.matchData.matchLookup
																	.blackPlayer.username
														}
													})
												}
											>
												<RemoveIcon
													style={{ fill: "white", fontSize: 25 }}
												/>
											</Box>
										)}
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Grid>
	);
};

const LobbyFourPlayer = (props) => {
	const classes = useStyles();

	const blankPlayerArr = [...Array(4 - props.matchData.matchLookup.players.length)];

	return (
		<Grid item xs={12}>
			<Box style={{ width: "100%" }}>
				<Paper style={{ width: "100%" }}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Lobby
					</Typography>
					<Divider />
					<Box p={3} display={"flex"}>
						{props.matchData.matchLookup.players.map((player, index) => (
							<Avatar key={index} src={player.avatar} className={classes.bigAvatar} />
						))}
						{blankPlayerArr.map((item, index) => (
							<Skeleton key={index} variant="rectangular" width={50} height={50} />
						))}
					</Box>
				</Paper>
			</Box>
		</Grid>
	);
};

const InviteFriends = (props) => {
	const { loading, error, data, subscribeToMore } = useQuery(GetFriends);

	const [inviteFriend] = useMutation(InviteFriend);

	useEffect(() => {
		subscribeToMore({
			document: NewFriend,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					selfLookup: {
						...prev.selfLookup,
						friends: [
							...prev.selfLookup.friends,
							{ username: subscriptionData.data.newFriend }
						]
					}
				};
			}
		});
	});

	const getNumberOfPlayers = () => {
		switch (props.matchData.matchLookup.__typename) {
			case "MatchTwoPlayer":
				return 2;
			case "MatchFourPlayer":
				return 4;
		}
	};

	if (loading || error || props.matchData.matchLookup.players.length === getNumberOfPlayers()) {
		return null;
	}

	const filteredFriends = data.selfLookup.friends.filter(
		(friend) =>
			!props.matchData.matchLookup.players
				.map((player) => player.username)
				.includes(friend.username)
	);

	return (
		<Grid item xs>
			<Box minWidth={400} height={"100%"}>
				<Paper style={{ width: "100%", height: "100%" }}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Invite A Friend
					</Typography>
					<Divider />
					{data.selfLookup.friends.length === 0 ? (
						<Box p={3}>
							<Typography style={{ fontSize: 17, fontWeight: 500 }}>
								Looks like you are missing some friends to invite. Search for users
								to add as friends above!
							</Typography>
						</Box>
					) : (
						<Box p={1}>
							<List>
								{filteredFriends.map((friend, index) => {
									const disabled = props.matchData.matchLookup.pendingPlayers
										.map((player) => player.username)
										.includes(friend.username);
									return (
										<ListItem key={index}>
											<ListItemAvatar>
												<Avatar src={friend.avatar} />
											</ListItemAvatar>
											<ListItemText primary={friend.username} />
											<ListItemSecondaryAction>
												<Box
													display={"flex"}
													justifyContent={"center"}
													alignItems={"center"}
												>
													<IconButton
														onClick={() =>
															inviteFriend({
																variables: {
																	matchId: props.matchId,
																	friendUsername: friend.username
																}
															})
														}
														disabled={disabled}
													>
														{disabled ? (
															<CheckIcon />
														) : (
															<GroupAddIcon />
														)}
													</IconButton>
												</Box>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})}
							</List>
						</Box>
					)}
				</Paper>
			</Box>
		</Grid>
	);
};

const MatchSettings = (props) => {
	const [matchName, setMatchName] = useState(props.matchData.matchLookup.name);
	const [editingMatchName, setEditingMatchName] = useState(false);

	if (props.matchData.selfLookup.username !== props.matchData.matchLookup.matchOwner.username) {
		return null;
	}

	return (
		<Grid item xs>
			<Box minWidth={450}>
				<Paper style={{ width: "100%" }}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Match Settings
					</Typography>
					<Divider />
					<Box p={3}>
						<Box>
							<Typography
								color="textSecondary"
								style={{ fontSize: 18, fontWeight: 500 }}
							>
								Match Name
							</Typography>
							<Divider />
							<Box
								pt={2}
								pl={2}
								pr={2}
								display={"flex"}
								justifyContent={"space-between"}
								alignItems={"center"}
							>
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
											!!matchName &&
											matchName.length > 20 &&
											"Match Name Is Too Long"
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
						<Box pt={3}>
							<Typography
								color="textSecondary"
								style={{ fontSize: 18, fontWeight: 500 }}
							>
								Game Size
							</Typography>
							<Divider />
							<Box pt={2}>
								<Box display={"flex"} flexWrap={"nowrap"} alignItems={"center"}>
									<Radio
										color={"primary"}
										checked={
											props.matchData.matchLookup.__typename ===
											"MatchTwoPlayer"
										}
										onChange={() => {
											if (
												props.matchData.matchLookup.__typename !==
												"MatchTwoPlayer"
											) {
												props.editMatch({
													variables: {
														matchId: props.matchId,
														gameType: "TWO_PLAYER"
													}
												});
											}
										}}
									/>
									<Typography>Two Player Match</Typography>
								</Box>
								<Box display={"flex"} flexWrap={"nowrap"} alignItems={"center"}>
									<Radio
										disabled
										color={"primary"}
										checked={
											props.matchData.matchLookup.__typename ===
											"MatchFourPlayer"
										}
										onChange={() => {
											if (
												props.matchData.matchLookup.__typename !==
												"MatchFourPlayer"
											) {
												props.editMatch({
													variables: {
														matchId: props.matchId,
														gameType: "FOUR_PLAYER"
													}
												});
											}
										}}
									/>
									<Typography>Four Player Match</Typography>
								</Box>
							</Box>
						</Box>
						<Box pt={3}>
							<Typography
								color="textSecondary"
								style={{ fontSize: 18, fontWeight: 500 }}
							>
								Timers
							</Typography>
							<Divider />
							<Box pt={2}>
								<Box display={"flex"} flexWrap={"nowrap"} alignItems={"center"}>
									<Radio
										disabled
										checked={true}
										color={"primary"}
										onChange={() => {}}
									/>
									<Typography>No Timers</Typography>
								</Box>
								<Box display={"flex"} flexWrap={"nowrap"} alignItems={"center"}>
									<Radio disabled color={"primary"} onChange={() => {}} />
									<Typography>2 Minute Timers</Typography>
								</Box>
								<Box display={"flex"} flexWrap={"nowrap"} alignItems={"center"}>
									<Radio disabled color={"primary"} onChange={() => {}} />
									<Typography>4 Minute Timers</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Grid>
	);
};

const SkinSelection = (props) => {
	const { loading, error, data } = useQuery(GetOwnedItems);

	if (loading || error) return null;

	const boardSkins = data.selfLookup.items.filter((item) => item.type === "BOARD_SKIN");
	const pieceSkins = data.selfLookup.items.filter((item) => item.type === "PIECE_SKIN");

	if (props.matchData.selfLookup.username !== props.matchData.matchLookup.matchOwner.username) {
		return null;
	}

	return (
		<Grid item xs>
			<Box minWidth={400}>
				<Paper style={{ width: "100%" }}>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 15, paddingBottom: 12, paddingLeft: 24 }}
					>
						Skin Selection
					</Typography>
					<Divider />
					<Box p={3}>
						<Box>
							<Typography
								color="textSecondary"
								style={{ fontSize: 18, fontWeight: 500 }}
							>
								Board Skin
							</Typography>
							<Divider />
							<Box pt={2}>
								{boardSkins.map((item, index) => (
									<Box
										key={index}
										display={"flex"}
										flexWrap={"nowrap"}
										alignItems={"center"}
									>
										<Radio
											color={"primary"}
											checked={
												props.matchData.matchLookup.boardSkin._id ===
												item._id
											}
											onChange={() => {
												if (
													props.matchData.matchLookup.boardSkin._id !==
													item._id
												) {
													props.editMatch({
														variables: {
															matchId: props.matchId,
															boardSkin: item._id
														}
													});
												}
											}}
										/>
										<Typography>{item.name}</Typography>
									</Box>
								))}
							</Box>
						</Box>
						<Box pt={4}>
							<Typography
								color="textSecondary"
								style={{ fontSize: 18, fontWeight: 500 }}
							>
								Piece Skin
							</Typography>
							<Divider />
							<Box pt={2}>
								{pieceSkins.map((item, index) => (
									<Box
										key={index}
										display={"flex"}
										flexWrap={"nowrap"}
										alignItems={"center"}
									>
										<Radio
											color={"primary"}
											checked={
												props.matchData.matchLookup.pieceSkin._id ===
												item._id
											}
											onChange={() => {
												if (
													props.matchData.matchLookup.boardSkin._id !==
													item._id
												) {
													props.editMatch({
														variables: {
															matchId: props.matchId,
															pieceSkin: item._id
														}
													});
												}
											}}
										/>
										<Typography>{item.name}</Typography>
									</Box>
								))}
							</Box>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Grid>
	);
};

export default PreGame;
