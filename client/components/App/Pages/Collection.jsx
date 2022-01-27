import { useState } from "react";

import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Tab, Tabs } from "@mui/material";

import { useQuery } from "@apollo/client";
import { GetUserShopInformation } from "../../../graphql/query.js";

import Item from "../../UI/Item.jsx";

const Collection = (props) => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [filters, setFilters] = useState({ showUnowned: false });

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
				</Tabs>
				<FormGroup row>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								checked={filters.showUnowned}
								onChange={() =>
									setFilters((filters) => ({
										...filters,
										showUnowned: !filters.showUnowned
									}))
								}
							/>
						}
						label="Show Unowned"
					/>
				</FormGroup>
			</Box>
			<Box pr={4} flexGrow={1} minHeight={250} height={250} className={"verticalScrollDiv"}>
				<SelectedTab selectedTab={selectedTab} filters={filters} data={data} />
			</Box>
		</Box>
	);
};

const SelectedTab = (props) => {
	switch (props.selectedTab) {
		case 0:
			return <PieceSkins filters={props.filters} data={props.data} />;
		case 1:
			return <BoardSkins filters={props.filters} data={props.data} />;
		default:
			return null;
	}
};

const PieceSkins = (props) => {
	
	return (
		<Grid container spacing={4}>
			{props.filters.showUnowned
				? props.data.shop.items
						.filter((item) => item.type === "PIECE_SKIN")
						.map((item, index) => (
							<Grid item key={index}>
								<Item
									name={item.name}
									description={item.description}
									thumbnail={item.thumbnail}
									showCheckMark={props.data.selfLookup.items
										.map((item) => item.name)
										.includes(item.name)}
								/>
							</Grid>
						))
				: props.data.selfLookup.items
						.filter((item) => item.type === "PIECE_SKIN")
						.map((item, index) => (
							<Grid item key={index}>
								<Item
									name={item.name}
									description={item.description}
									thumbnail={item.thumbnail}
									showCheckMark={true}
								/>
							</Grid>
						))}
		</Grid>
	);
};

const BoardSkins = (props) => {
	return (
		<Grid container spacing={4}>
			{props.filters.showUnowned
				? props.data.shop.items
						.filter((item) => item.type === "BOARD_SKIN")
						.map((item, index) => (
							<Grid item key={index}>
								<Item
									name={item.name}
									description={item.description}
									thumbnail={item.thumbnail}
									showCheckMark={props.data.selfLookup.items
										.map((item) => item.name)
										.includes(item.name)}
								/>
							</Grid>
						))
				: props.data.selfLookup.items
						.filter((item) => item.type === "BOARD_SKIN")
						.map((item, index) => (
							<Grid item key={index}>
								<Item
									name={item.name}
									description={item.description}
									thumbnail={item.thumbnail}
									showCheckMark={true}
								/>
							</Grid>
						))}
		</Grid>
	);
};

export default Collection;
