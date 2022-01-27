const path = require("path");
const fs = require("fs");

const iconDir = path.resolve(__dirname, "static", "icons");

if (process.env["WINDOWS_CODESIGN_FILE"]) {
	const certPath = path.join(__dirname, "win-certificate.pfx");
	const certExists = fs.existsSync(certPath);
	if (certExists) {
		process.env["WINDOWS_CODESIGN_FILE"] = certPath;
	}
}

const config = {
	packagerConfig: {
		name: "King's Corner",
		executableName: "kings-corner",
		appBundleId: "com.meta-games.kings-corner",
		asar: true,
		icon: path.resolve(iconDir, "kcorner"),
		ignore: [
			"client/components",
			"client/graphql",
			"client/static",
			"scripts",
			"server",
			"test"
		],
		overwrite: true,
		quiet: true,
		osxSign: {
			identity: "Developer ID Application: Max Rosoff (CC9JLY9894)",
			hardenedRuntime: true,
			"gatekeeper-assess": false,
			entitlements: path.resolve(__dirname, "static", "entitlements.plist"),
			"entitlements-inherit": path.resolve(__dirname, "static", "entitlements.plist"),
			"signature-flags": "library"
		},
		win32metadata: {
			OriginalFilename: "King's Corner"
		}
	},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			platforms: ["win32"],
			config: () => {
				return {
					authors: "Max Rosoff, Ben Gillet, Matthew Ernst",
					certificateFile: process.env["WINDOWS_CODESIGN_FILE"],
					certificatePassword: process.env["WINDOWS_CODESIGN_PASSWORD"],
					exe: "kings-corner.exe",
					iconUrl: "https://kings-corner.games/images/kcorner.ico",
					loadingGif: "./assets/loading.gif",
					name: "kings-corner",
					noMsi: true,
					setupExe: `kings-corner-setup.exe`,
					setupIcon: path.resolve(iconDir, "kcorner.ico"),
				};
			}
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"]
		},
		{
			name: "@electron-forge/maker-dmg",
			config: { name: "kings-corner", overwrite: true }
		},
		{
			name: "@electron-forge/maker-deb",
			platforms: ["linux"],
			config: {
				icon: { scalable: path.resolve(iconDir, "kcorner.svg") },
				options: {
					genericName: "King's Corner",
					homepage: "kings-corner.games",
					name: "kings-corner",
					productName: "King's Corner",
					section: "games"
				}
			}
		},
		{
			name: "@electron-forge/maker-rpm",
			platforms: ["linux"],
			config: {
				options: {
					genericName: "King's Corner",
					homepage: "kings-corner.games",
					name: "kings-corner",
					productName: "King's Corner"
				}
			}
		}
	],
	publishers: [
		{
			name: "@electron-forge/publisher-github",
			config: { draft: false, repository: { owner: "M3tanym", name: "Kings-Corner" } }
		}
	]
};

function notarizeMaybe() {
	if (process.platform !== "darwin") return;
	if (!process.env.CI) {
		console.log(`Not In CI, Skipping Notarization`);
		return;
	}
	if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
		console.warn("ENV Variables APPLE_ID or APPLE_ID_PASSWORD Are Missing!");
		return;
	}
	config.packagerConfig.osxNotarize = {
		appBundleId: "com.meta-games.kings-corner",
		appleId: process.env.APPLE_ID,
		appleIdPassword: process.env.APPLE_ID_PASSWORD,
		ascProvider: "CC9JLY9894"
	};
}

notarizeMaybe();
module.exports = config;
