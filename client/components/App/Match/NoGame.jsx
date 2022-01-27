import { Link } from "react-router-dom";

import { Box, Grid, Typography } from "@mui/material";

const NoGame = (props) => {
	return (
		<Grid
			container
			style={{ height: "100%" }}
			direction={"column"}
			spacing={2}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Grid item>
				<Typography style={{ fontSize: 30, fontWeight: 500 }}>
					There is no Match at this URL
				</Typography>
			</Grid>
			<Grid item>
				<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
					<Typography variant={"body2"}>Lost?</Typography>
					<Link to={"/app/dashboard"} style={{ paddingLeft: 5 }}>
						<Typography variant={"body2"} color={"primary"}>
							Dashboard
						</Typography>
					</Link>
				</Box>
			</Grid>
		</Grid>
	);
};

export default NoGame;
