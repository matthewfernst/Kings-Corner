import { useEffect } from "react";

import {
	Avatar,
	Badge,
	Box,
	ClickAwayListener,
	Divider,
	Grid,
	Grow,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Popper,
	Typography
} from "@mui/material";
import { AvatarGroup } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import { useMutation, useQuery } from "@apollo/client";
import { GetHeaderNotifications } from "../../../graphql/query.js";
import { ResolveRequestFriend, ResolveInviteFriend } from "../../../graphql/mutation.js";
import { NewFriendRequest, NewMatchInvite } from "../../../graphql/subscription.js";

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: theme.spacing(5),
		height: theme.spacing(5)
	}
}));

const Notifications = (props) => {
	const handleClose = (event) => {
		if (props.anchorRef.current && props.anchorRef.current.contains(event.target)) return;
		props.handleOpen(null);
	};

	const { loading, error, data, subscribeToMore } = useQuery(GetHeaderNotifications);

	const [resolveRequestFriend] = useMutation(ResolveRequestFriend, {
		refetchQueries: [GetHeaderNotifications]
	});

	const [resolveInviteFriend] = useMutation(ResolveInviteFriend, {
		refetchQueries: [GetHeaderNotifications]
	});

	useEffect(() => {
		subscribeToMore({
			document: NewFriendRequest,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					selfLookup: {
						...prev.selfLookup,
						incomingFriendRequests: [
							...(prev.selfLookup.incomingFriendRequests || []),
							{
								username: subscriptionData.data.newFriendRequest
							}
						]
					}
				};
			}
		});
		subscribeToMore({
			document: NewMatchInvite,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					selfLookup: {
						...prev.selfLookup,
						matchInvites: [
							...(prev.selfLookup.matchInvites || []),
							{
								players: [
									...(prev.selfLookup.matchInvites?.players || []),
									{
										username: subscriptionData.data.newMatchInvite
									}
								]
							}
						]
					}
				};
			}
		});
	});

	if (loading || error) return null;

	return (
		<>
			<Grid container alignItems={"center"}>
				<IconButton onClick={() => props.handleOpen("notifications")}>
					<Badge
						color="secondary"
						variant="dot"
						invisible={
							data.selfLookup.matchInvites.length === 0 &&
							data.selfLookup.incomingFriendRequests.length === 0
						}
					>
						<NotificationsOutlinedIcon />
					</Badge>
				</IconButton>
			</Grid>
			<Popper
				open={props.openDropdown === "notifications"}
				anchorEl={props.anchorRef.current}
				transition
				style={{ zIndex: 999 }}
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === "bottom" ? "center top" : "center bottom"
						}}
					>
						<Box
							sx={{
								p: 1,
								width: 350,
								height: 250,
								bgcolor: "#FAFAFA",
								border: 2,
								borderColor: "neutral.mediumDark"
							}}
						>
							<ClickAwayListener onClickAway={handleClose}>
								<Box sx={{ p: 1 }}>
									<Typography
										color="textSecondary"
										style={{ fontSize: 18, fontWeight: 500 }}
									>
										Friend Requests
									</Typography>
									<Divider />
									{data.selfLookup.incomingFriendRequests.length === 0 && (
										<Box sx={{ pt: 2 }}>
											<Typography
												color="textPrimary"
												style={{ fontSize: 15, fontWeight: 500 }}
											>
												You have no new friend requests
											</Typography>
										</Box>
									)}
									<NotificationsFriendRequests
										data={data}
										resolveRequestFriend={resolveRequestFriend}
									/>
									<Typography
										color="textSecondary"
										style={{ fontSize: 18, fontWeight: 500 }}
									>
										Match Invites
									</Typography>
									<Divider />
									{data.selfLookup.matchInvites.length === 0 && (
										<Box sx={{ pt: 2 }}>
											<Typography
												color="textPrimary"
												style={{ fontSize: 15, fontWeight: 500 }}
											>
												You have no new match invites
											</Typography>
										</Box>
									)}
									<NotificationMatchRequests
										data={data}
										resolveInviteFriend={resolveInviteFriend}
									/>
								</Box>
							</ClickAwayListener>
						</Box>
					</Grow>
				)}
			</Popper>
		</>
	);
};

const NotificationsFriendRequests = (props) => {
	return (
		<List>
			{props.data.selfLookup.incomingFriendRequests.map((friend, index) => (
				<ListItem key={index}>
					<AvatarGroup max={2} style={{ paddingRight: 20 }}>
						<Avatar src={friend.avatar} key={index} />
					</AvatarGroup>
					<ListItemText>{friend.username}</ListItemText>
					<ListItemSecondaryAction>
						<IconButton
							onClick={() =>
								props.resolveRequestFriend({
									variables: {
										friendUsername: friend.username,
										choice: false
									}
								})
							}
						>
							<ClearIcon />
						</IconButton>
						<IconButton
							onClick={() =>
								props.resolveRequestFriend({
									variables: {
										friendUsername: friend.username,
										choice: true
									}
								})
							}
						>
							<CheckIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

const NotificationMatchRequests = (props) => {
	return (
		<List>
			{props.data.selfLookup.matchInvites.map((match, index) => (
				<ListItem key={index}>
					<AvatarGroup max={2} style={{ paddingRight: 20 }}>
						{match.players.map((player, index) => (
							<Avatar src={player.avatar} key={index} />
						))}
					</AvatarGroup>
					<ListItemText>{match.players[0].username}</ListItemText>
					<ListItemSecondaryAction>
						<IconButton
							onClick={() =>
								props.resolveInviteFriend({
									variables: {
										matchId: match._id,
										choice: false
									}
								})
							}
						>
							<ClearIcon />
						</IconButton>
						<IconButton
							onClick={() =>
								props.resolveInviteFriend({
									variables: {
										matchId: match._id,
										choice: true
									}
								})
							}
						>
							<CheckIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

export default Notifications;
