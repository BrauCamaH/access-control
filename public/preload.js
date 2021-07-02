const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  removeEventListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  // Invoke Methods
  testInvoke: (args) => ipcRenderer.invoke("test-invoke", args),
  // Send Methods
  testSend: (args) => ipcRenderer.send("test-send", args),
  // Receive Methods
  testReceive: (callback) =>
    ipcRenderer.on("test-receive", (event, data) => {
      callback(data);
    }),
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
