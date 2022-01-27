import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginLayout from "./Login/Layout.jsx";
import Login from "./Login/Login.jsx";
import CreateAccount from "./Login/CreateAccount.jsx";
import ForgotPassword from "./Login/ForgotPassword.jsx";

import AppLayout from "./App/Layout.jsx";

import DashBoard from "./App/Pages/Dashboard.jsx";
import Matches from "./App/Pages/Matches.jsx";
import Match from "./App/Match/Match.jsx";
import BattlePass from "./App/Pages/BattlePass.jsx";
import Collection from "./App/Pages/Collection.jsx";
import Shop from "./App/Pages/Shop.jsx";

import Profile from "./App/Pages/Profile.jsx";
import NotFound from "./NotFound.jsx";
import FinalizeAccount from "./Login/FinalizeAccount.jsx";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={"/"} element={<LoginLayout />}>
					<Route index element={<Login />} />
					<Route path={"create-account"} element={<CreateAccount />} />
					<Route path={"login"} element={<Login />} />
					<Route path={"finalize-account"} element={<FinalizeAccount />} />
					<Route path={"forgot-password"} element={<ForgotPassword />} />
					<Route path={"forgot-password/:authToken"} element={<ForgotPassword />} />
				</Route>
				<Route path={"/app"} element={<AppLayout />}>
					<Route index element={<DashBoard />} />
					<Route path={"profile"} element={<Profile />} />
					<Route path={"match-history"} element={<Profile />} />
					<Route path={"dashboard"} element={<DashBoard />} />
					<Route path={"matches"} element={<Matches />} />
					<Route path={"matches/:matchId"} element={<Match />} />
					<Route path={"battle-pass"} element={<BattlePass />} />
					<Route path={"collection"} element={<Collection />} />
					<Route path={"shop"} element={<Shop />} />
				</Route>
				<Route path={"*"} element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
