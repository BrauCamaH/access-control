const { app, BrowserWindow, ipcMain } = require("electron"); // electron
const isDev = require("electron-is-dev"); // To check if electron is in development mode
const path = require("path");

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const port = new SerialPort("/dev/ttyUSB0", { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

let mainWindow;

// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200, // width of window
    height: 600, // height of window
    webPreferences: {
      // The preload file where we will perform our app communication
      preload: isDev
        ? path.join(app.getAppPath(), "./public/preload.js") // Loading it from the public folder for dev
        : path.join(app.getAppPath(), "./build/preload.js"), // Loading it from the build folder for production
      worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
      contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
    },
  });

  !isDev && mainWindow.setMenu(null);
  // Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Loading localhost if dev mode
      : `file://${path.join(__dirname, "../build/index.html")}` // Loading build file if in production
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  mainWindow.setIcon(path.join(__dirname, "logo-vn.png"));

  // In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  "userData",
  isDev
    ? path.join(app.getAppPath(), "userdata/") // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, "userdata/") // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
  await createWindow(); // Create the mainWindow
});

// Exiting the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activating the app
app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("quit-app", (args) => {
  app.quit();
});

ipcMain.on("requestTag", async (event, args) => {
  parser.on("data", (data) => {
    console.log(data);
    event.sender.send("getTagId", data);
  });
});

let rfidStatus;

port.on("open", () => {
  console.log("Rfid detectado");
  rfidStatus = {
    message: "Lector Detectado",
    success: true,
  };
});

port.on("error", () => {
  console.log("Error en lector");
  rfidStatus = {
    message: "Error en lector",
    success: false,
  };
});

ipcMain.on("requestRfidStatus", async (event, args) => {
  console.log("Rfid Status requested", rfidStatus);
  event.sender.send("getRfidStatus", rfidStatus);
});
