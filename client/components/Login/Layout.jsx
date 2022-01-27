import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import { Box, Grid, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { grey } from "@mui/material/colors";

import { motion } from "framer-motion";

import Carousel1 from "../../static/images/carousel/carousel1.jpg";
import Carousel2 from "../../static/images/carousel/carousel2.jpg";
import Carousel3 from "../../static/images/carousel/carousel3.jpg";
import Carousel4 from "../../static/images/carousel/carousel4.jpg";

const useStyles = makeStyles((theme) => ({
	rootPadding: {
		[theme.breakpoints.up("xs")]: {
			padding: theme.spacing(0)
		},
		[theme.breakpoints.up("sm")]: {
			padding: theme.spacing(8)
		},
		[theme.breakpoints.up("lg")]: {
			padding: theme.spacing(10)
		},
		[theme.breakpoints.up("xl")]: {
			padding: theme.spacing(20)
		}
	}
}));

const Layout = (props) => {
	const classes = useStyles();
	const loginAreaWidth = 475;
	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				bgcolor: "primary.main"
			}}
			className={classes.rootPadding}
		>
			<Paper elevation={8} sx={{ height: "100%", display: "flex" }} square>
				<ImageCarousel />
				<Box
					sx={{
						height: "100%",
						width: { xs: "100%", sm: loginAreaWidth },
						minWidth: loginAreaWidth,
						p: 4
					}}
				>
					<Outlet />
				</Box>
			</Paper>
		</Box>
	);
};

const ImageCarousel = (props) => {
	const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);

	let images = [Carousel1, Carousel2, Carousel3, Carousel4];

	useEffect(() => {
		let nextImageTimer = setInterval(() => {
			setCarouselActiveIndex((prevIndex) => {
				if (prevIndex < images.length - 1) return prevIndex + 1;
				else return 0;
			});
		}, 8000);
		return () => clearInterval(nextImageTimer);
	}, []);

	return (
		<Box
			flexGrow={1}
			height={"100%"}
			position={"relative"}
			style={{ overflow: "hidden" }}
			sx={{ display: { xs: "none", sm: "block" } }}
		>
			<img
				alt={"Chess Background"}
				src={images[carouselActiveIndex]}
				style={{
					objectFit: "cover",
					width: "100%",
					minHeight: "100%"
				}}
			/>
			<Box
				style={{ width: "100%", position: "absolute", bottom: 30 }}
				sx={{ display: { xs: "none", md: "block" } }}
			>
				<Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
					{images.map((_, i) => (
						<Grid item key={i}>
							<CarouselIndicator
								active={carouselActiveIndex === i}
								onClick={() => setCarouselActiveIndex(i)}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

const CarouselIndicator = (props) => {
	const variants = {
		active: { width: 30, backgroundColor: "#FFFFFF" },
		other: { width: 10, backgroundColor: grey[300] }
	};

	return (
		<motion.div
			animate={props.active ? "active" : "other"}
			variants={variants}
			style={{ height: 10, borderRadius: 10 }}
			onClick={props.onClick}
		/>
	);
};

export default Layout;
