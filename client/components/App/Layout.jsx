import { useEffect, useState } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
	Avatar,
	Box,
	Divider,
	IconButton,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	TextField,
	Typography
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import HomeIcon from "@mui/icons-material/Home";
import SendIcon from "@mui/icons-material/Send";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import clsx from "clsx";

import { DateTime } from "luxon";

import { useQuery, useMutation } from "@apollo/client";
import { GetMessages } from "../../graphql/query.js";
import { SendMessage, ReadMessage } from "../../graphql/mutation.js";
import { NewMessage } from "../../graphql/subscription.js";

import HeaderBar from "./HeaderBar.jsx";
import SideBar from "./SideBar.jsx";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
	content: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginRight: drawerWidth
	},
	drawer: {
		transition: theme.transitions.create("min-width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	drawerShift: {
		transition: theme.transitions.create("min-width", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		minWidth: drawerWidth
	}
}));

const Layout = (props) => {
	const classes = useStyles();
	const [openMessages, setOpenMessages] = useState(false);
	const [activeMessageUser, setActiveMessageUser] = useState(null);

	const { loading, error, data, subscribeToMore } = useQuery(GetMessages);

	const [sendMessage] = useMutation(SendMessage, { refetchQueries: [GetMessages] });
	const [readMessage] = useMutation(ReadMessage, { refetchQueries: [GetMessages] });

	useEffect(() => {
		subscribeToMore({
			document: NewMessage,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;

				return {
					...prev,
					selfLookup: {
						...prev.selfLookup,
						messages: [
							...(prev.selfLookup.messages || []),
							{
								...subscriptionData.data.newMessage,
								from: {
									username: subscriptionData.data.newMessage.from
								}
							}
						]
					}
				};
			}
		});
	}, []);

	const hasUnreadMessages = () => {
		if (!data) return false;
		const readByPerMessageList = data.selfLookup.messages.map((message) =>
			message.readBy.map((readBy) => readBy.username)
		);
		let hasntReadAMessage = false;
		for (let i = 0; i < readByPerMessageList.length; i++) {
			if (!readByPerMessageList[i].includes(data.selfLookup.username)) {
				hasntReadAMessage = true;
			}
		}
		return hasntReadAMessage;
	};

	return (
		<Box sx={{ width: "100vw", minHeight: "100vh" }}>
			<Box sx={{ height: 75 }}>
				<HeaderBar
					hasUnreadMessages={hasUnreadMessages()}
					openMessages={openMessages}
					setOpenMessages={setOpenMessages}
					setActiveMessageUser={setActiveMessageUser}
					{...props}
				/>
			</Box>
			<Box sx={{ display: "flex", flexWrap: "nowrap", minHeight: "calc(100vh - 75px)" }}>
				<Box sx={{ minWidth: 280, p: 4, bgcolor: "neutral.light" }}>
					<SideBar {...props} />
				</Box>
				<Box sx={{ flexGrow: 1, p: 4, bgcolor: "neutral.medium" }} className={"app"}>
					<ProtectedRoute>
						<Outlet />
					</ProtectedRoute>
				</Box>
				<Box
					className={clsx(classes.drawer, { [classes.drawerShift]: openMessages })}
					sx={{ bgcolor: "neutral.light", minWidth: 0, width: 0 }}
				>
					<Box
						sx={{
							width: drawerWidth,
							height: "100%",
							display: "flex",
							flexDirection: "column"
						}}
					>
						<Grid
							container
							alignItems={"center"}
							justifyContent={"space-between"}
							style={{
								paddingTop: 10,
								paddingBottom: 10,
								paddingLeft: 20,
								paddingRight: 20,
								minHeight: 65
							}}
						>
							<Typography variant={"h6"}>Messages</Typography>
							{activeMessageUser ? (
								<IconButton onClick={() => setActiveMessageUser(null)}>
									<HomeIcon />
								</IconButton>
							) : null}
						</Grid>
						<Divider />
						{loading || error ? null : (
							<Messages
								data={data}
								readMessage={readMessage}
								sendMessage={sendMessage}
								activeMessageUser={activeMessageUser}
								setActiveMessageUser={setActiveMessageUser}
							/>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

const ProtectedRoute = (props) => {
	const location = useLocation();

	if (localStorage.getItem("token")) {
		return props.children;
	}

	return <Navigate to={"/login"} state={{ from: location }} />;
};

const Messages = (props) => {
	const [message, setMessage] = useState("");

	if (!props.activeMessageUser) return <MessagesHome {...props} />;

	const messagesWithUser = props.data.selfLookup.messages.filter(
		(message) =>
			message.to.username === props.activeMessageUser ||
			message.from.username === props.activeMessageUser
	);
	const sortedByDate = messagesWithUser.sort(
		(a, b) => DateTime.fromMillis(a.message.date) > DateTime.fromMillis(b.message.date)
	);

	return (
		<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
			<Box
				sx={{ pt: 3, pb: 3, flexGrow: 1, minHeight: 250, height: 250 }}
				className={"verticalScrollDiv"}
			>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					{sortedByDate.map((message, index) => {
						const fromMe = message.from.username === props.data.selfLookup.username;
						return (
							<Box
								key={index}
								sx={{
									mt: 2,
									display: "flex",
									justifyContent: fromMe ? "flex-end" : "flex-start"
								}}
							>
								<Box sx={{ pl: 3, pr: 3 }}>
									<Box
										sx={{
											pt: 1,
											pb: 1,
											pl: 2,
											pr: 2,
											width: 180,
											borderRadius: Math.floor(
												(15 / message.message.length) * 50
											),
											bgcolor: fromMe ? "primary.main" : "secondary.main"
										}}
									>
										<Typography style={{ color: "#FFF" }}>
											{message.message}
										</Typography>
									</Box>
									<Box sx={{ pr: 1 }}>
										<Typography
											style={{
												color: "#555",
												fontSize: 12,
												textAlign: "right"
											}}
										>
											{DateTime.fromMillis(message.date).toFormat(
												"MMMM Do, h:mm a"
											)}
										</Typography>
									</Box>
								</Box>
							</Box>
						);
					})}
				</Box>
			</Box>
			<Divider />
			<Box
				sx={{
					p: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<TextField
					fullWidth
					variant={"standard"}
					placeholder={"Message"}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							if (message === "") return;
							props.sendMessage({
								variables: {
									friendUsername: props.activeMessageUser,
									message: message
								}
							});
							setMessage("");
						}
					}}
				/>
				<Box sx={{ pl: 2 }}>
					<IconButton
						disabled={message === ""}
						onClick={() => {
							props.sendMessage({
								variables: {
									friendUsername: props.activeMessageUser,
									message: message
								}
							});
							setMessage("");
						}}
					>
						<SendIcon />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
};

const MessagesHome = (props) => {
	if (props.data.selfLookup.messages.length === 0) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography>
					You Have No Messages. Use The Search To Find Someone To Message.
				</Typography>
			</Box>
		);
	}

	const dataByUser = props.data.selfLookup.messages.reduce((array, message) => {
		const user =
			message.from.username === props.data.selfLookup.username
				? message.to.username
				: message.from.username;
		const avatar =
			message.from.username === props.data.selfLookup.username
				? message.to.avatar
				: message.from.avatar;
		const pos = array.map((element) => element.username).indexOf(user);
		if (pos === -1) array.push({ username: user, avatar: avatar });
		return array;
	}, []);

	return (
		<Box sx={{ p: 2 }}>
			<List>
				{dataByUser.map((userObj, index) => (
					<ListItem key={index}>
						<ListItemAvatar>
							<Avatar src={userObj.avatar} />
						</ListItemAvatar>
						<ListItemText
							primary={userObj.username}
							secondary={
								props.data.selfLookup.messages
									.map((message) =>
										message.readBy.map((reader) => reader.username)
									)
									.filter((readBy) =>
										readBy.includes(props.data.selfLookup.username)
									).length <
								props.data.selfLookup.messages.map((message) =>
									message.readBy.map((reader) => reader.username)
								).length
									? "New Message"
									: undefined
							}
						/>
						<ListItemSecondaryAction>
							<IconButton
								onClick={() => {
									props.setActiveMessageUser(userObj.username);
									props.data.selfLookup.messages
										.filter(
											(message) =>
												message.from.username === userObj.username ||
												message.to.username === userObj.username
										)
										.map((message) => message._id)
										.forEach((messageId) => {
											props.readMessage({
												variables: {
													messageId: messageId
												}
											});
										});
								}}
							>
								<NavigateNextOutlinedIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default Layout;
