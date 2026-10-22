const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('hriam', {
  platform: process.platform,
  isDesktop: true,
});
