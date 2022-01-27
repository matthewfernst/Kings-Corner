const { app, BrowserWindow, screen } = require("electron");

if (require("electron-squirrel-startup")) return app.quit();
require("update-electron-app")({ notifyUser: false });

let mainWindow;
let dev = false;

if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	dev = true;
}

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		width: width - 50,
		height: height - 50,
		webPreferences: { nodeIntegration: true, contextIsolation: false }
	});

	if (dev && process.argv.indexOf("--noDevServer") === -1) {
		mainWindow.loadURL("http://localhost:3000/login");
	} else {
		mainWindow.loadURL("https://kings-corner.games/login");
	}

	mainWindow.setMenuBarVisibility(false);
	mainWindow.once("ready-to-show", () => mainWindow.show());
	mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", async () => createWindow());
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
