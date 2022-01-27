import {
	Box,
	ClickAwayListener,
	Divider,
	Grid,
	Grow,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Popper
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useQuery } from "@apollo/client";
import { GetMissions } from "../../../graphql/query.js";

const Missions = (props) => {
	const handleClose = (event) => {
		if (props.anchorRef.current && props.anchorRef.current.contains(event.target)) return;
		props.handleOpen(null);
	};

	const { loading, error, data } = useQuery(GetMissions);

	if (loading || error) return null;

	return (
		<>
			<Grid container alignItems={"center"} sx={{ pr: 2 }}>
				<IconButton onClick={() => props.handleOpen("missions")}>
					<MapIcon />
				</IconButton>
			</Grid>
			<Popper
				open={props.openDropdown === "missions"}
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
								width: 350,
								height: 250,
								bgcolor: "#FAFAFA",
								border: 2,
								borderColor: "neutral.mediumDark"
							}}
						>
							<ClickAwayListener onClickAway={handleClose}>
								<Box sx={{ p: 2 }}>
									<Typography
										color="textSecondary"
										style={{ fontSize: 18, fontWeight: 500 }}
									>
										Current Missions
									</Typography>
									<Divider />
									<List>
										{data.selfLookup.missions.length === 0 ? (
											<Box sx={{ pt: 2 }}>
												<Typography
													color="textPrimary"
													style={{ fontSize: 15, fontWeight: 500 }}
												>
													You have no current missions
												</Typography>
											</Box>
										) : (
											<CurrentMissions data={data} />
										)}
									</List>
								</Box>
							</ClickAwayListener>
						</Box>
					</Grow>
				)}
			</Popper>
		</>
	);
};

const XPLoader = (props) => {
	return (
		<Box sx={{ mr: 2, position: "relative" }}>
			<CircularProgress
				size={55}
				variant="determinate"
				value={100}
				color={"secondary"}
				style={{
					position: "absolute",
					top: 0,
					left: 0
				}}
			/>
			<CircularProgress size={55} variant="determinate" {...props} />
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transform: "translate(-50%, -50%)"
				}}
			>
				<Typography variant="caption" color="textSecondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
};

const CurrentMissions = (props) => {
	return (
		<List>
			{props.data.selfLookup.missions.map((mission, index) => (
				<ListItem key={index}>
					<XPLoader value={(mission.progress / mission.threshold) * 100} />

					<ListItemText
						primary={mission.name}
						secondary={
							<Typography variant={"caption"} style={{ fontWeight: 500 }}>
								{mission.description}
							</Typography>
						}
					/>
				</ListItem>
			))}
		</List>
	);
};

export default Missions;
