import { useRef, useState } from "react";
import Measure from "react-measure";

import { useNavigate } from "react-router-dom";

import {
	Avatar,
	Box,
	ClickAwayListener,
	Divider,
	Grow,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	Popper,
	Typography
} from "@mui/material";
import { AvatarGroup } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GetInfoFromSearch } from "../../../graphql/query.js";
import { RequestFriend } from "../../../graphql/mutation.js";
import Chess from "chess.js";

const Search = (props) => {
	const [searchText, setSearchText] = useState("");
	const [getSearchInfo, { loading, error, data }] = useLazyQuery(GetInfoFromSearch);

	const [requestFriend] = useMutation(RequestFriend, { refetchQueries: [GetInfoFromSearch] });

	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const mergeRefs = (...refs) => {
		const filteredRefs = refs.filter(Boolean);
		if (!filteredRefs.length) return null;
		if (filteredRefs.length === 0) return filteredRefs[0];
		return (inst) => {
			for (const ref of filteredRefs) {
				if (typeof ref === "function") {
					ref(inst);
				} else if (ref) {
					ref.current = inst;
				}
			}
		};
	};

	return (
		<Measure>
			{({ measureRef, contentRect }) => (
				<>
					<Box
						id={"searchBox"}
						sx={{
							p: 2,
							minWidth: 400,
							flexGrow: 1,
							bgcolor: "neutral.light"
						}}
						ref={mergeRefs(anchorRef, measureRef)}
						onClick={() => setOpen((prevOpen) => !prevOpen)}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								height: "100%"
							}}
							ref={measureRef}
						>
							<Box sx={{ mt: "4px", ml: 2 }}>
								<SearchOutlinedIcon />
							</Box>
							<Box sx={{ flexGrow: 1, ml: 2, mr: 2 }}>
								<InputBase
									fullWidth
									placeholder={"Search"}
									onChange={(e) => {
										setSearchText(e.target.value);
										getSearchInfo({ variables: { query: e.target.value } });
									}}
									value={searchText}
								/>
							</Box>
						</Box>
					</Box>
					{loading || error || !data ? null : (
						<SearchDropdown
							open={open}
							setOpen={setOpen}
							anchorRef={anchorRef}
							resizeWidth={contentRect.entry.width + 32}
							data={data}
							requestFriend={requestFriend}
							{...props}
						/>
					)}
				</>
			)}
		</Measure>
	);
};

const SearchDropdown = (props) => {
	return (
		<Popper
			open={props.open}
			anchorEl={props.anchorRef.current}
			style={{ zIndex: 999 }}
			transition
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
							width: props.resizeWidth,
							maxHeight: 450,
							bgcolor: "neutral.light",
							border: 2,
							borderColor: "neutral.mediumDark"
						}}
						className={"verticalScrollDiv"}
					>
						<ClickAwayListener onClickAway={() => props.setOpen(false)}>
							<Box sx={{ p: 1 }}>
								<MatchSection {...props} />
								<FriendSection {...props} />
								<OtherSection {...props} />
							</Box>
						</ClickAwayListener>
					</Box>
				</Grow>
			)}
		</Popper>
	);
};

const MatchSection = (props) => {
	const navigate = useNavigate();

	const data = props.data.selfLookup.matches.concat(props.data.matchSearch);
	return (
		<Box>
			<Typography color="textSecondary" style={{ fontSize: 18, fontWeight: 500 }}>
				Matches
			</Typography>
			<Divider />
			{data.length === 0 ? (
				<Box sx={{ pt: 2 }}>
					<Typography color="textPrimary" style={{ fontSize: 15, fontWeight: 500 }}>
						No matches found
					</Typography>
				</Box>
			) : (
				<List>
					{data.map((match, index) => (
						<ListItem key={index}>
							<AvatarGroup max={2} style={{ paddingRight: 20 }}>
								{match.players.map((player, index) => (
									<Avatar src={player.avatar} key={index} />
								))}
							</AvatarGroup>
							<ListItemText
								primary={match.name || "Untitled Match"}
								secondary={
									match.inProgress &&
									new Chess(match.fen).turn() ===
										(match.whitePlayer.username ===
										props.data.selfLookup.username
											? "w"
											: "b")
										? "Your Turn"
										: "Their Turn"
								}
							/>
							<ListItemSecondaryAction>
								<IconButton onClick={() => navigate("/app/matches/" + match._id)}>
									<ChevronRightIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			)}
		</Box>
	);
};

const FriendSection = (props) => {
	const friendsInMyMatches = props.data.selfLookup.friends.filter((friend) => {
		const playerLists = friend.matches.map((match) =>
			match.players.map((player) => player.username)
		);
		for (let i = 0; i < playerLists.length; i++) {
			if (playerLists[i].includes(props.data.selfLookup.username)) return true;
		}
		return false;
	});

	const friendsNotInMyMatches = props.data.selfLookup.friends.filter(
		(friend) => !friendsInMyMatches.map((friend) => friend.username).includes(friend.username)
	);

	const data = friendsInMyMatches.concat(friendsNotInMyMatches);

	return (
		<Box sx={{ pt: 2 }}>
			<Typography color="textSecondary" style={{ fontSize: 18, fontWeight: 500 }}>
				Friends
			</Typography>
			<Divider />
			{!props.data.selfLookup.friends ? (
				<Box sx={{ pt: 2 }}>
					<Typography color="textPrimary" style={{ fontSize: 15, fontWeight: 500 }}>
						No friends found
					</Typography>
				</Box>
			) : (
				<List>
					{data.map((friend, index) => (
						<ListItem key={index}>
							<ListItemAvatar>
								<Avatar src={friend.avatar} />
							</ListItemAvatar>
							<ListItemText>{friend.username}</ListItemText>
							<ListItemSecondaryAction>
								<Box sx={{ display: "flex" }}>
									<Box sx={{ pr: 1 }}>
										<IconButton
											onClick={() => {
												props.setActiveMessageUser(friend.username);
												props.setOpenMessages(true);
												props.setOpen(false);
											}}
										>
											<ChatBubbleOutlineIcon />
										</IconButton>
									</Box>
									<IconButton
										onClick={() =>
											props.requestFriend({
												variables: {
													friendUsername: user.username
												}
											})
										}
									>
										<AddCircleIcon />
									</IconButton>
								</Box>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			)}
		</Box>
	);
};

const OtherSection = (props) => {
	const data = props.data.userSearch.filter(
		(user) =>
			!props.data.selfLookup.friends
				.map((friend) => friend.username)
				.includes(user.username) && props.data.selfLookup.username !== user.username
	);

	return (
		<Box sx={{ pt: 2 }}>
			<Typography color="textSecondary" style={{ fontSize: 18, fontWeight: 500 }}>
				Other
			</Typography>
			<Divider />
			<List>
				{data.map((user, index) => {
					const disabled = props.data.selfLookup.outgoingFriendRequests
						.map((user) => user.username)
						.includes(user.username);
					return (
						<ListItem key={index}>
							<AvatarGroup max={2} style={{ paddingRight: 20 }}>
								<Avatar src={user.avatar} key={index} />
							</AvatarGroup>
							<ListItemText primary={user.username} />
							<ListItemSecondaryAction>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center"
									}}
								>
									<IconButton
										onClick={() =>
											props.requestFriend({
												variables: {
													friendUsername: user.username
												}
											})
										}
										disabled={disabled}
									>
										{disabled ? <CheckIcon /> : <PersonAddIcon />}
									</IconButton>
								</Box>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>
		</Box>
	);
};

export default Search;
