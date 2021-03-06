const { app, BrowserWindow, ipcMain, Menu } = require("electron"); // electron
const isDev = require("electron-is-dev"); // To check if electron is in development mode
const path = require("path");

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const admin = require("firebase-admin");

isDev
  ? require("dotenv").config()
  : (process.env.GOOGLE_APPLICATION_CREDENTIALS =
      "/home/pi/Documents/Access/firebase-key.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const fcm = admin.messaging();
const db = admin.firestore();

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

  !isDev &&
    mainWindow.setMenu(
      Menu.buildFromTemplate([
        {
          role: "appMenu",
          label: "opciones",
          submenu: [
            {
              label: "Revisar Lector",
              click() {
                mainWindow.reload();
              },
            },
          ],
        },
      ])
    );
  // Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Loading localhost if dev mode
      : `file://${path.join(__dirname, "../build/index.html")}` // Loading build file if in production
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  mainWindow.setIcon(path.join(__dirname, "icon.png"));
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

ipcMain.on("requestRfidStatus", async (event, args) => {
  SerialPort.list()
    .then((ports) => {
      if (ports.length === 0) {
        console.log("No ports discovered");
      } else {
        console.log("ports", ports);
        let rfidStatus;

        let { path, pnpId } = ports[0];

        console.log(pnpId);

        if (pnpId === undefined) {
          event.sender.send("getRfidStatus", {
            message: "Error en Lector",
            success: false,
          });

          return;
        }

        const port = new SerialPort(
          path,
          {
            baudRate: 9600,
          },
          function (err) {
            if (err) {
              if (pnpId) {
                event.sender.send("getRfidStatus", {
                  message: "Lector Detectado",
                  success: true,
                });
                return;
              }

              event.sender.send("getRfidStatus", {
                message: "Error en Lector",
                success: false,
              });

              console.log(err);
              return console.log("Error: ", err.message);
            }

            event.sender.send("getRfidStatus", {
              message: "Lector Detectado",
              success: true,
            });
          }
        );

        const parser = port.pipe(new Readline({ delimiter: "\n" }));

        ipcMain.on("requestTag", async (event, args) => {
          console.log("Rfid Status requested", rfidStatus);
          parser.on("data", (data) => {
            console.log(data);
            event.sender.send("getTagId", data);
          });
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
});

ipcMain.on("sendAccessNotification", (event, args) => {
  const { title, body } = args;
  db.collection("tokens")
    .get()
    .then((snapshot) => {
      const tokens = snapshot.docs.map((snap) => snap.id);

      const payload = {
        notification: { title, body },
      };

      fcm
        .sendToDevice(tokens, payload)
        .then(() => {
          console.log("Notification sent");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});
