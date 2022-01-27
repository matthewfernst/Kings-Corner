import { useState } from "react";

import { Box, ButtonBase, Chip, Grid, Paper, Tab, Tabs, Typography, useTheme } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";

import { useQuery, useMutation } from "@apollo/client";
import { GetUserShopInformation } from "../../../graphql/query.js";

import Item from "../../UI/Item.jsx";
import { BuyItem } from "../../../graphql/mutation.js";

const Shop = (props) => {
	const theme = useTheme();

	const [selectedTab, setSelectedTab] = useState(0);

	const { loading, error, data } = useQuery(GetUserShopInformation);

	if (loading || error) return null;

	return (
		<Box height={"100%"} display={"flex"} flexDirection={"column"}>
			<Box mb={4} display={"flex"} justifyContent={"space-between"}>
				<Tabs
					value={selectedTab}
					indicatorColor="primary"
					textColor="primary"
					onChange={(e, tab) => setSelectedTab(tab)}
				>
					<Tab label="Piece Skins" disableRipple />
					<Tab label="Board Skins" disableRipple />
					<Tab label="Battle Pass" disableRipple />
				</Tabs>
				<Box width={90} height={40} mr={2} bgcolor={"primary.main"} borderRadius={"200px"}>
					<Box
						height={"100%"}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
					>
						<Typography style={{ color: "white", fontSize: 18 }}>
							$ {data.selfLookup.money}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box pr={4} flexGrow={1} minHeight={250} height={250} className={"verticalScrollDiv"}>
				<SelectedTab selectedTab={selectedTab} data={data} />
			</Box>
		</Box>
	);
};

const SelectedTab = (props) => {
	switch (props.selectedTab) {
		case 0:
			return <PieceSkins data={props.data} />;
		case 1:
			return <BoardSkins data={props.data} />;
		case 2:
			return <BattlePass data={props.data} />;
		default:
			return null;
	}
};

const PieceSkins = (props) => {
	const [confirmPurchase, setConfirmPurchase] = useState({});

	const handleToggle = (itemId) => {
		setConfirmPurchase({ ...confirmPurchase, [itemId]: !confirmPurchase[itemId] });
	};

	const pieceSkins = props.data.shop.items
		.filter((item) => !props.data.selfLookup.items.map((item) => item._id).includes(item._id))
		.filter((item) => item.type === "PIECE_SKIN");

	if (pieceSkins.length === 0) {
		return (
			<Box height={"50%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Typography variant="h5">You Own All The Piece Skins!</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={4}>
			{pieceSkins.map((item, index) => (
				<Grid item key={index}>
					<ButtonBase onClick={() => handleToggle(item._id)} disableRipple>
						<Item
							name={item.name}
							description={item.description}
							thumbnail={item.thumbnail}
							showCost={true}
							cost={item.cost}
						/>
						{confirmPurchase[item._id] ? (
							<ConfirmPurchase
								name={item.name}
								confirmPurchase={confirmPurchase}
								itemId={item._id}
							/>
						) : null}
					</ButtonBase>
				</Grid>
			))}
		</Grid>
	);
};

const BoardSkins = (props) => {
	const [confirmPurchase, setConfirmPurchase] = useState({});

	const handleToggle = (itemId) => {
		setConfirmPurchase({ ...confirmPurchase, [itemId]: !confirmPurchase[itemId] });
	};

	const boardSkins = props.data.shop.items
		.filter((item) => !props.data.selfLookup.items.map((item) => item._id).includes(item._id))
		.filter((item) => item.type === "BOARD_SKIN");

	if (boardSkins.length === 0) {
		return (
			<Box height={"50%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Typography variant="h5">You Own All The Board Skins!</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={4}>
			{boardSkins.map((item, index) => (
				<Grid item key={index}>
					<ButtonBase onClick={() => handleToggle(item._id)} disableRipple>
						<Item
							name={item.name}
							description={item.description}
							thumbnail={item.thumbnail}
							showCost={true}
							cost={item.cost}
						/>
						{confirmPurchase[item._id] ? (
							<ConfirmPurchase
								name={item.name}
								confirmPurchase={confirmPurchase}
								itemId={item._id}
							/>
						) : null}
					</ButtonBase>
				</Grid>
			))}
		</Grid>
	);
};

const BattlePass = (props) => {
	const [confirmPurchase, setConfirmPurchase] = useState({});

	const handleToggle = (itemId) => {
		setConfirmPurchase({ ...confirmPurchase, [itemId]: !confirmPurchase[itemId] });
	};

	const battlePass = props.data.shop.items.filter((item) => item.type === "BATTLE_PASS");

	if (props.data.selfLookup.battlePass) {
		return (
			<Box height={"50%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Typography variant="h5">You Already Own A Battle Pass!</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={4}>
			{battlePass.map((item, index) => (
				<Grid item key={index}>
					<ButtonBase onClick={() => handleToggle(item._id)} disableRipple>
						<Item
							name={item.name}
							description={item.description}
							showCost={true}
							cost={item.cost}
							thumbnail={item.thumbnail}
						/>
						{confirmPurchase[item._id] ? (
							<ConfirmPurchase
								name={item.name}
								confirmPurchase={confirmPurchase}
								itemId={item._id}
							/>
						) : null}
					</ButtonBase>
				</Grid>
			))}
		</Grid>
	);
};

const ConfirmPurchase = (props) => {
	const theme = useTheme();

	const [doMutation] = useMutation(BuyItem, { refetchQueries: [GetUserShopInformation] });

	const buyItemMutation = () => {
		doMutation({
			variables: {
				itemId: props.itemId
			}
		});
	};

	return (
		<Backdrop
			sx={{
				position: "absolute",
				zIndex: theme.zIndex.drawer + 1,
				backgroundColor: theme.palette.primary.main
			}}
			open={props.confirmPurchase[props.itemId]}
		>
			<Chip
				sx={{ color: "#FFFFFF" }}
				label={"Confirm Purchase"}
				onClick={buyItemMutation}
			></Chip>
		</Backdrop>
	);
};

export default Shop;
