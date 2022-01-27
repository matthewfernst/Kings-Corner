import { Box, Divider, Grid, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GetBattlePassItems } from "../../../graphql/query";

const BattlePass = (props) => {
	const { loading, error, data } = useQuery(GetBattlePassItems);
	if (loading || error) return null;
	const items = data.selfLookup.battlePass.items;
	const stepCount = data.selfLookup.battlePass.currentTier - 1;

	return (
		<Paper style={{ width: "100%", height: "75%" }}>
			<Grid container justifyContent={"space-between"} alignItems={"center"}>
				<Grid item>
					<Typography
						variant={"h6"}
						style={{ paddingTop: 18, paddingBottom: 12, paddingLeft: 25 }}
					>
						Battle Pass
					</Typography>
				</Grid>
			</Grid>
			<Divider />
			<Box p={2} flexGrow={1} display={"flex"}>
				<Box
					flexGrow={1}
					height={"100%"}
					width={500}
					display={"flex"}
					flexDirection={"column"}
					className={"horizontalScrollDiv"}
				>
					<Box display={"flex"} alignContent={"center"} alignItems={"center"}>
						<Stepper alternativeLabel activeStep={stepCount}>
							{items.map((item, index) => (
								<Step key={index}>
									<StepLabel>
										<Grid item key={index} style={{ marginTop: 50 }}>
											<img src={item.thumbnail} style={{ height: 145 }} />
										</Grid>

										<Box p={2}>
											<Typography variant={"h6"} align={"center"}>
												{item.name}
											</Typography>
											<Typography variant={"body2"} align={"center"}>
												{item.description}
											</Typography>
										</Box>
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Box>
				</Box>
			</Box>
		</Paper>
	);
};

export default BattlePass;
