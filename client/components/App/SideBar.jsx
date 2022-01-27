import { Link, useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Grid, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RedeemIcon from "@mui/icons-material/Redeem";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { useQuery, useMutation } from "@apollo/client";
import { GetBattlePassItems } from "../../graphql/query.js";
import { CreateMatch } from "../../graphql/mutation.js";

const SideBar = (props) => {
	const { loading, error, data } = useQuery(GetBattlePassItems);

	const menuEntries = [
		{ text: "Dashboard", icon: DashboardIcon },
		{ text: "Matches", icon: SportsEsportsIcon },
		{
			text: "Battle Pass",
			icon: RedeemIcon,
			disabled: loading || error || !data.selfLookup.battlePass
		},
		{ text: "Collection", icon: LocalMallIcon },
		{ text: "Shop", icon: StorefrontIcon }
	];

	const navigate = useNavigate();
	const location = useLocation();

	const [createMatch] = useMutation(CreateMatch, {
		onCompleted: (data) => navigate("/app/matches/" + data.createMatch._id)
	});

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexWrap: "nowrap",
				flexDirection: "column",
				justifyContent: "center"
			}}
		>
			<Box>
				<Button
					fullWidth
					variant={"contained"}
					color={"primary"}
					style={{ height: 50, borderRadius: 8, textTransform: "none" }}
					onClick={createMatch}
				>
					<Box sx={{ width: "100%" }}>
						<Grid container justifyContent={"center"} alignItems={"center"}>
							<Typography>Create Match</Typography>
						</Grid>
					</Box>
				</Button>
			</Box>
			<Box sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
				{menuEntries.map((item, index) => (
					<NavMenuItem
						key={index}
						icon={item.icon}
						active={location.pathname.includes(
							item.text.replace(" ", "-").toLowerCase()
						)}
						disabled={item.disabled}
					>
						{item.text}
					</NavMenuItem>
				))}
			</Box>
		</Box>
	);
};

const NavMenuItem = (props) => {
	const Icon = props.icon;

	const NavButton = (props) => {
		return (
			<Button
				fullWidth
				color={"inherit"}
				disabled={props.disabled}
				sx={{ height: 50, borderRadius: "8px", textTransform: "none" }}
			>
				<Box sx={{ paddingLeft: "20px", width: "100%" }}>
					<Grid container alignItems={"center"}>
						<Icon color={props.active ? "primary" : undefined} />
						<Box pl={2}>
							<Typography>{props.children}</Typography>
						</Box>
					</Grid>
				</Box>
			</Button>
		);
	};

	return (
		<Box sx={{ mt: 1 }}>
			{props.disabled ? (
				<NavButton {...props} />
			) : (
				<Link
					to={`/app/${props.children.replace(" ", "-").toLowerCase()}`}
					className={"no-line"}
				>
					<NavButton {...props} />
				</Link>
			)}
		</Box>
	);
};

export default SideBar;
