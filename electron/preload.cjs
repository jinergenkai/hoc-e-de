const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hriam', {
  platform: process.platform,
  isDesktop: true,
  savePdf: (fileName) => ipcRenderer.invoke('save-pdf', fileName),
});
