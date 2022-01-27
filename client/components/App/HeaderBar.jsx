import { useRef, useState } from "react";

import { Badge, Box, Grid, IconButton } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";

import Logo from "../UI/Logo.jsx";
import Search from "./HeaderBar/Search.jsx";
import Missions from "./HeaderBar/Missions.jsx";
import Notifications from "./HeaderBar/Notifications.jsx";
import Profile from "./HeaderBar/Profile.jsx";

const HeaderBar = (props) => {
	return (
		<Box sx={{ display: "flex", flexWrap: "nowrap", height: "100%" }}>
			<LogoHeader />
			<Search {...props} />
			<ActionButtons
				hasUnreadMessages={props.hasUnreadMessages}
				openMessages={props.openMessages}
				setOpenMessages={props.setOpenMessages}
			/>
			<Profile />
		</Box>
	);
};

const LogoHeader = (props) => {
	return (
		<Box sx={{ p: 2, minWidth: 280 }}>
			<Grid item container justifyContent={"center"} alignItems={"center"}>
				<Grid item>
					<Logo black height={50} link={"/app/dashboard"} />
				</Grid>
			</Grid>
		</Box>
	);
};

const ActionButtons = (props) => {
	const anchorRef = useRef(null);
	const [openDropdown, setOpenDropdown] = useState(null);
	const handleOpen = (clicked) => {
		if (openDropdown && openDropdown === clicked) {
			setOpenDropdown(null);
		} else {
			setOpenDropdown(clicked);
		}
	};

	return (
		<Box ref={anchorRef} sx={{ p: 2, display: "flex", flexWrap: "nowrap", height: "100%" }}>
			<Messages {...props} />
			<Missions anchorRef={anchorRef} openDropdown={openDropdown} handleOpen={handleOpen} />
			<Notifications
				anchorRef={anchorRef}
				openDropdown={openDropdown}
				handleOpen={handleOpen}
			/>
		</Box>
	);
};

const Messages = (props) => {
	return (
		<Grid container alignItems={"center"} sx={{ pr: 2 }}>
			<IconButton onClick={() => props.setOpenMessages(!props.openMessages)}>
				<Badge color="secondary" variant="dot" invisible={!props.hasUnreadMessages}>
					<ForumIcon />
				</Badge>
			</IconButton>
		</Grid>
	);
};

export default HeaderBar;
