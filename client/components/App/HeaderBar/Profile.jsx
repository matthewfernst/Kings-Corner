import { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
	Avatar,
	Button,
	Box,
	ClickAwayListener,
	Grid,
	Grow,
	Icon,
	IconButton,
	Popper,
	Typography
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { useQuery } from "@apollo/client";
import { GetHeaderProfile } from "../../../graphql/query.js";

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: theme.spacing(5),
		height: theme.spacing(5)
	}
}));

const Profile = (props) => {
	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) return;
		setOpen(false);
	};

	const { loading, error, data } = useQuery(GetHeaderProfile);

	if (loading || error) return null;

	return (
		<>
			<Box
				ref={anchorRef}
				sx={{
					p: 2,
					maxWidth: 300,
					display: "flex",
					flexWrap: "noWrap",
					alignItems: "center"
				}}
			>
				<Box sx={{ pr: 2 }}>
					<Avatar
						alt={"Profile"}
						src={data.selfLookup.avatar}
						className={classes.avatar}
					/>
				</Box>
				<Box sx={{ pr: 2 }}>
					<Typography variant={"subtitle2"}>{data.selfLookup.username}</Typography>
				</Box>
				<IconButton onClick={() => setOpen(!open)}>
					<ExpandMoreIcon />
				</IconButton>
			</Box>
			<ProfileDropdown open={open} handleClose={handleClose} anchorRef={anchorRef} />
		</>
	);
};

const ProfileDropdown = (props) => {
	const navigate = useNavigate();
	return (
		<Popper open={props.open} anchorEl={props.anchorRef.current} transition>
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
							width: 250,
							bgcolor: "#FAFAFA",
							border: 2,
							borderColor: "neutral.mediumDark"
						}}
					>
						<ClickAwayListener onClickAway={props.handleClose}>
							<Box>
								<Link to={"/app/profile"} className={"no-line"}>
									<Button
										fullWidth
										color={"inherit"}
										sx={{
											height: 50,
											borderRadius: "8px",
											textTransform: "none"
										}}
									>
										<Grid
											container
											style={{ paddingLeft: 20 }}
											alignItems={"center"}
										>
											<PersonIcon />
											<Box sx={{ pl: 2 }}>
												<Typography>Profile</Typography>
											</Box>
										</Grid>
									</Button>
								</Link>
								<Button
									fullWidth
									color={"inherit"}
									sx={{
										height: 50,
										borderRadius: "8px",
										textTransform: "none"
									}}
									onClick={() => {
										navigate("/login");
										localStorage.removeItem("token");
									}}
								>
									<Grid
										container
										style={{ paddingLeft: 20 }}
										alignItems={"center"}
									>
										<ExitToAppIcon />
										<Box sx={{ pl: 2 }}>
											<Typography>Logout</Typography>
										</Box>
									</Grid>
								</Button>
							</Box>
						</ClickAwayListener>
					</Box>
				</Grow>
			)}
		</Popper>
	);
};

export default Profile;
