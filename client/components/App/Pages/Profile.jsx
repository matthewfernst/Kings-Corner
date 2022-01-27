import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	TextField,
	Typography
} from "@mui/material";
import { AvatarGroup, Skeleton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CreateIcon from "@mui/icons-material/Create";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SaveIcon from "@mui/icons-material/Save";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useQuery, useMutation } from "@apollo/client";
import { GetMatchHistory, GetTraditionalProfile, GetUserSettings } from "../../../graphql/query.js";
import { CreateMatch, EditUser } from "../../../graphql/mutation.js";

const useStyles = makeStyles(() => ({
	hoverPaper: {
		cursor: "pointer",
		"&:hover": {
			boxShadow:
				"0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)"
		}
	}
}));

const Profile = () => {
	return (
		<Grid container spacing={4} style={{ height: "100%" }}>
			<UserDetails />
			<EditUserInfo />
			<MatchHistory />
		</Grid>
	);
};

const UserDetails = (props) => {
	const { loading, error, data } = useQuery(GetTraditionalProfile, {
		pollInterval: 5000
	});
	const [editUser] = useMutation(EditUser);

	if (loading || error) return null;

	const handleCapture = ({ target }) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(target.files[0]);
		fileReader.onload = (e) => {
			let img = document.createElement("img");

			img.onload = function () {
				let canvas = document.createElement("canvas");
				let ctx = canvas.getContext("2d");

				const dimension = 100;
				canvas.width = dimension;
				canvas.height = dimension;

				ctx.drawImage(this, 0, 0, dimension, dimension);
				editUser({
					variables: { avatar: canvas.toDataURL() }
				});
			};

			img.src = e.target.result;
		};
	};

	return (
		<Grid item xs style={{ maxWidth: 420 }}>
			<Paper>
				<Box p={4} display={"flex"} alignContent={"center"} alignItems={"center"}>
					<Box position={"relative"}>
						<Avatar
							alt={"User Profile"}
							src={data.selfLookup.avatar}
							style={{ width: 150, height: 150 }}
						/>
						<Box position={"absolute"} bottom={-5} right={-5}>
							<input
								accept="image/*"
								id="button-file"
								type="file"
								onChange={handleCapture}
								style={{ display: "none" }}
							/>
							<label htmlFor="button-file">
								<IconButton color={"primary"} component="span">
									<AddPhotoAlternateIcon />
								</IconButton>
							</label>
						</Box>
					</Box>
					<Box ml={4} flexGrow={1}>
						<Typography variant={"h4"}>{data.selfLookup.username}</Typography>
						{data.selfLookup.rating && (
							<Typography variant={"h6"}>Rating: {data.user.rating}</Typography>
						)}
						<Box pt={1}>
							<Typography variant={"subtitle2"}>
								History: {data.selfLookup.playerStatistics.wins}
								{" / "}
								{data.selfLookup.playerStatistics.losses}
								{" / "}
								{data.selfLookup.playerStatistics.stalemates}
							</Typography>
							<Typography variant={"subtitle2"}>
								Games: {data.selfLookup.playerStatistics.totalGames}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Grid>
	);
};

const EditUserInfo = (props) => {
	const { loading, error, data } = useQuery(GetUserSettings);
	const [editUser] = useMutation(EditUser);

	if (loading || error) return null;

	return (
		<Grid item xs style={{ minWidth: 400, maxWidth: 600 }}>
			<Paper>
				<Box p={4} display={"flex"} flexDirection={"column"}>
					<Fields data={data.selfLookup} editUser={editUser} />
				</Box>
			</Paper>
		</Grid>
	);
};

const Fields = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = (event) => event.preventDefault();

	return (
		<>
			<Field value={props.data.email} label={"Email"} editUser={props.editUser} />
			<Field
				value={props.data.username}
				label={"Username"}
				style={{ marginTop: 15 }}
				editUser={props.editUser}
			/>
			<Field
				editUser={props.editUser}
				value={props.data.password}
				label={"Password"}
				style={{ marginTop: 15 }}
				type={showPassword ? "text" : "password"}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
								edge="end"
							>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
		</>
	);
};

const Field = (props) => {
	const [value, setValue] = useState(props.value);
	const [disabled, setDisabled] = useState(true);
	return (
		<Box
			display={"flex"}
			justifyContent={"space-between"}
			alignItems={"center"}
			style={props.style}
		>
			<TextField
				fullWidth
				size="small"
				label={props.label}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				type={props.type}
				InputProps={props.InputProps}
				disabled={disabled}
			/>
			<Box ml={4}>
				<IconButton
					color="primary"
					onClick={() => {
						if (!disabled) {
							props.editUser({ variables: { [props.label.toLowerCase()]: value } });
						}
						setDisabled(!disabled);
					}}
				>
					{disabled ? <CreateIcon /> : <SaveIcon />}
				</IconButton>
			</Box>
		</Box>
	);
};

const MatchHistory = (props) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const { loading, error, data } = useQuery(GetMatchHistory);
	const [createMatch] = useMutation(CreateMatch);

	if (error) return null;
	if (loading) return <Skeleton variant="rectangular" width={"100%"} height={"100%"} />;

	return (
		<Grid item xs style={{ minWidth: 400 }}>
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
						Match History
					</Typography>
					<Divider />
					<Box p={1} flexGrow={1}>
						{data.selfLookup.finishedMatches.length > 0 ? (
							<List>
								{data.selfLookup.finishedMatches.map((match, index) => {
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
									You don't have any finished matches!
								</Typography>
								<Box pt={2}>
									<Button onClick={() => createMatch()}>
										<Box p={1}>
											<Typography variant={"subtitle2"} color={"primary"}>
												Create A Match
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

export default Profile;
