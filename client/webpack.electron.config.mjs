import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { spawn } from "child_process";

import webpackConfig from "./webpack.website.config.mjs";

const output = "../dist/electron";

webpackConfig.devServer.open = false;
webpackConfig.devServer.static.watch = { ignored: [path.resolve(__dirname, "../main.cjs")] };
webpackConfig.devServer.onBeforeSetupMiddleware = () => {
	spawn("electron", ["."], { shell: true, env: process.env, stdio: "inherit" })
		.on("close", (code) => process.exit(code))
		.on("error", (spawnError) => console.error(spawnError));
};
webpackConfig.output = { filename: "bundle.js", path: path.join(__dirname, output) };
webpackConfig.target = "electron-renderer";

export default webpackConfig;
