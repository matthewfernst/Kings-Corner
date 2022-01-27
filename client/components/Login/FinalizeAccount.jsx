import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { red } from "@mui/material/colors";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import clsx from "clsx";

import { useMutation, useQuery } from "@apollo/client";
import { GetHeaderProfile } from ".//../../graphql/query.js";
import { EditUser } from "../../graphql/mutation.js";

import { SignInButton } from "../UI/Buttons.jsx";
import Logo from "../UI/Logo.jsx";

const useStyles = makeStyles((theme) => ({
	textFieldPadding: {
		marginTop: theme.spacing(1)
	},
	alertPadding: {
		marginTop: theme.spacing(2)
	},
	sectionPadding: {
		marginTop: theme.spacing(3)
	},
	loginFailedAlert: {
		color: "white",
		backgroundColor: red[700],
		borderRadius: 200,
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 15,
		paddingRight: 15
	}
}));

const FinalizeAccount = (props) => {
	const classes = useStyles();
	const [alertText, setAlertText] = useState("");

	useEffect(() => {
		setTimeout(() => setAlertText(""), 10000);
	}, [alertText]);

	const { data, loading, error } = useQuery(GetHeaderProfile);

	if (loading || error) return null;
	if (!data || data.selfLookup.username) {
		window.location.href = "/login";
	}

	return (
		<Box
			height={"100%"}
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
			className={"verticalScrollDiv"}
		>
			<Logo black height={50} />
			<Box
				flexGrow={1}
				width={"100%"}
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				className={classes.sectionPadding}
			>
				<Typography variant={"h5"} align={"center"}>
					Create Account
				</Typography>
				<Typography variant={"body1"} align={"center"} className={classes.textFieldPadding}>
					Give us a few details, and you will be on your way.
				</Typography>
				{alertText && <FinalizeAccountAlert>{alertText}</FinalizeAccountAlert>}
				<FinalizeAccountArea setAlertText={setAlertText} />
				<BackToSignInArea />
			</Box>
		</Box>
	);
};

const FinalizeAccountArea = (props) => {
	const classes = useStyles();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const [doMutation, { loading }] = useMutation(EditUser, {
		onCompleted: (data) => {
			navigate("/app");
		},
		onError: (data) => {
			props.setAlertText("Username Already Exists");
		}
	});

	const editUser = () => {
		if (!username) {
			props.setAlertText("Please Provide A Username");
		} else if (username.length > 12) {
			props.setAlertText("Username Must Be 12 Characters Or Shorter");
		} else if (!password) {
			props.setAlertText("Please Provide A Password");
		} else {
			doMutation({ variables: { username, password } });
		}
	};

	return (
		<Box
			width={"100%"}
			display={"flex"}
			flexDirection={"column"}
			justifyContent={"center"}
			alignItems={"center"}
			className={classes.sectionPadding}
		>
			<Fields
				username={username}
				setUsername={setUsername}
				password={password}
				setPassword={setPassword}
				editUser={editUser}
			/>
			<Box className={classes.sectionPadding}>
				<SignInButton onClick={editUser} disabled={loading} loading={loading}>
					Create Account
				</SignInButton>
			</Box>
		</Box>
	);
};

const Fields = (props) => {
	const classes = useStyles();
	const moveDown = (currentInputIndex) => {
		document.getElementsByTagName("input")[currentInputIndex + 1].focus();
	};

	return (
		<Box
			width={"90%"}
			display={"flex"}
			flexDirection={"column"}
			justifyContent={"center"}
			alignItems={"center"}
			style={{ paddingBottom: 20 }}
		>
			<TextField
				fullWidth
				className={classes.textFieldPadding}
				variant={"standard"}
				label={"Username"}
				value={props.username}
				onChange={(e) => props.setUsername(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") moveDown(1);
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<AccountCircleIcon />
						</InputAdornment>
					)
				}}
			/>
			<TextField
				fullWidth
				className={classes.textFieldPadding}
				variant={"standard"}
				type={"password"}
				label={"Password"}
				value={props.password}
				onChange={(e) => props.setPassword(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") props.editUser();
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					)
				}}
			/>
		</Box>
	);
};

const BackToSignInArea = (props) => {
	const classes = useStyles();
	return (
		<Box
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
			className={classes.sectionPadding}
		>
			<Typography variant={"body2"}>Already have an account?</Typography>
			<Link to={"/login"} style={{ paddingLeft: 5 }}>
				<Typography variant={"body2"} color={"primary"}>
					Sign In
				</Typography>
			</Link>
		</Box>
	);
};

const FinalizeAccountAlert = (props) => {
	const classes = useStyles();
	return (
		<Box className={clsx(classes.alertPadding, classes.loginFailedAlert)}>{props.children}</Box>
	);
};

export default FinalizeAccount;
