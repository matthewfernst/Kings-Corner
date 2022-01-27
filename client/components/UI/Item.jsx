import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const Item = (props) => {
	const theme = useTheme();
	return (
		<Paper>
			<Box width={320} height={350} pt={6} pb={6} pl={3} pr={3} position={"relative"}>
				{props.showCheckMark ? (
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bgcolor={"primary.main"}
						borderRadius={"100%"}
						style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30 }}
					>
						<CheckIcon style={{ color: "white", fontSize: 18 }} />
					</Box>
				) : props.showCost ? (
					<Box
						height={"100%"}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bgcolor={"primary.main"}
						borderRadius={"20px"}
						p={1}
						style={{ position: "absolute", top: 10, right: 10, width: 60, height: 30 }}
					>
						<Typography style={{ color: "white" }}>$ {props.cost}</Typography>
					</Box>
				) : null}
				<Grid
					container
					direction={"column"}
					spacing={4}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Grid item>
						<img src={props.thumbnail} style={{ height: 100, maxWidth: 180 }} />
					</Grid>
					<Grid item container direction={"column"} spacing={1}>
						<Grid item>
							<Typography variant={"h6"} align={"center"}>
								{props.name}
							</Typography>
						</Grid>
						<Grid item>
							<Typography align={"center"}>{props.description}</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
};

export default Item;
