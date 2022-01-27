import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import webpack from "webpack";
import NodemonPlugin from "nodemon-webpack-plugin";
import nodeExternals from "webpack-node-externals";

const output = "../dist";

export default {
	entry: "./server/index.js",
	experiments: {
		topLevelAwait: true
	},
	devtool: "eval-source-map",
	mode: process.env.NODE_ENV || "development",
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	output: { filename: "server.js", path: path.join(__dirname, output), publicPath: "" },
	plugins: [
		new NodemonPlugin({
			watch: path.resolve("./dist/server.js")
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
		})
	],
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	stats: "errors-only",
	target: "node",
	externalsPresets: { node: true },
	externals: [nodeExternals()]
};
