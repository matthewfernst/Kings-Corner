import { Box, CssBaseline, Typography } from "@mui/material";
import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
	StyledEngineProvider
} from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { from, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import Router from "./Router.jsx";

import Black from "../static/images/logo/logo_black.png";

const App = () => {
	let theme = createTheme({
		palette: {
			mode: "light",
			primary: { main: "#653D23" },
			secondary: { main: "#008080" },
			neutral: {
				main: "#FFFFFF",
				light: grey[100],
				medium: grey[200],
				mediumDark: grey[300],
				dark: grey[600]
			}
		}
	});
	theme = responsiveFontSizes(theme);

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Box sx={{ display: { xs: "none", md: "block" } }}>
					<FullApp />
				</Box>
				<Box sx={{ display: { xs: "block", md: "none" } }}>
					<MobileApp />
				</Box>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

const FullApp = (props) => {
	const httpLink = new HttpLink({
		uri: "/graphql",
		credentials: "same-origin"
	});

	const authLink = setContext((_, { headers }) => {
		const token = localStorage.getItem("token");
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : ""
			}
		};
	});

	const wsLink = new WebSocketLink({
		uri:
			!process.env.NODE_ENV || process.env.NODE_ENV === "development"
				? "ws://localhost:8000/graphql"
				: "wss://kings-corner.games/graphql",
		options: {
			timeout: 30000,
			reconnect: true,
			connectionParams: () => {
				const token = localStorage.getItem("token");
				return {
					authorization: token ? `Bearer ${token}` : ""
				};
			}
		}
	});
	const errorLink = onError(({ graphQLErrors }) => {
		if (graphQLErrors) {
			if (
				graphQLErrors
					.map((error) => error.extensions.code)
					.includes("INTERNAL_SERVER_ERROR")
			) {
				graphQLErrors.forEach((error) => {
					if (!error.message) console.error(`An Unknown Error Has Occurred`);
					console.error(`Error: ${error.message}. Operation: ${error.path}`);
				});
			} else if (
				graphQLErrors.map((error) => error.extensions.code).includes("UNAUTHENTICATED")
			) {
				window.location.href = "/login";
			}
		}
	});

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" && definition.operation === "subscription"
			);
		},
		wsLink,
		authLink.concat(httpLink)
	);

	const additiveLink = from([errorLink, splitLink]);

	const client = new ApolloClient({
		link: additiveLink,
		cache: new InMemoryCache()
	});

	return (
		<ApolloProvider client={client}>
			<Router />
		</ApolloProvider>
	);
};

const MobileApp = (props) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh"
			}}
		>
			<img alt={"Kings Corner Logo"} src={Black} style={{ height: 50 }} />
			<Box
				sx={{
					p: 4,
					pt: 6,
					pl: 10,
					pr: 10,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center"
				}}
			>
				<Typography variant={"h2"} align={"center"} style={{ fontWeight: 600 }}>
					Welcome To The Future Of Chess
				</Typography>
				<Box sx={{ pt: 4 }}>
					<Typography variant={"h6"} align={"center"} style={{ fontWeight: 400 }}>
						A place to battle your opponents to their last breath, and where you can
						showcase your victories to the world.
					</Typography>
				</Box>
				<Box sx={{ pt: 8 }}>
					<Typography align={"center"} style={{ fontWeight: 400 }}>
						Visit us on your desktop at
					</Typography>
					<Typography align={"center"} style={{ fontWeight: 400 }}>
						<a href={"https://kings-corner.games"}>kings-corner.games</a>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};
export default App;
