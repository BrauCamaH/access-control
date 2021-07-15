const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  removeEventListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  sendNotification: (args) => ipcRenderer.send("sendAccessNotification", args),
  // Receive Methods
  requestRfidStatus: (args) => ipcRenderer.send("requestRfidStatus", args),
  getRfidStatus: (callback) =>
    ipcRenderer.on("getRfidStatus", (event, data) => {
      callback(data);
    }),
  quitApp: (args) => ipcRenderer.send("quit-app", args),
  requestTagId: (args) => ipcRenderer.send("requestTag", args),
  getTagId: (callback) =>
    ipcRenderer.on("getTagId", (event, data) => {
      callback(data);
    }),
});
