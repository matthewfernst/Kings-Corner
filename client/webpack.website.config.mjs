import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const output = "../dist/website";

export default {
	entry: "./client/index.jsx",
	devServer: {
		static: {
			directory: path.resolve(__dirname, output)
		},
		port: 3000,
		open: true,
		hot: true,
		historyApiFallback: {
			rewrites: [
				{
					from: /^\/.+\..+$/,
					to: function (context) {
						const f = context.parsedUrl.pathname.split("/");
						return "/" + f[f.length - 1];
					}
				}
			]
		},
		proxy: { "/graphql": "http://localhost:8000" }
	},
	devtool: "eval-source-map",
	mode: process.env.NODE_ENV || "development",
	module: {
		rules: [
			{
				test: /\.m?jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{ test: /\.css$/i, use: ["style-loader", "css-loader"] },
			{
				test: /\.s[ac]ss$/i,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: { plugins: ["autoprefixer"] }
						}
					},
					{ loader: "sass-loader" }
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpe?g|gif|mp4|wav|mp3)$/i,
				loader: "file-loader"
			}
		]
	},
	output: { filename: "bundle.js", path: path.join(__dirname, output), publicPath: "/" },
	plugins: [
		new HtmlWebpackPlugin({
			template: "./client/static/template/index.html",
			favicon: "./client/static/icons/kcorner.ico",
			title: "Kings Corner"
		}),
		new CopyPlugin({
			patterns: [
				{ from: "./client/static/images", to: "./images" },
				{ from: "./client/static/email", to: "./email" }
			]
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
		})
	],
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	stats: "minimal"
};
