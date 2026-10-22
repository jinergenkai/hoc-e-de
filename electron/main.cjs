const { app, BrowserWindow, dialog, ipcMain, session, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'Hriăm Êđê',
    backgroundColor: '#F9FAFB',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Links leave the app window and open in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.ELECTRON_DEV_URL) {
    win.loadURL(process.env.ELECTRON_DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// Certificate → PDF via a save dialog (uses the page's print stylesheet)
ipcMain.handle('save-pdf', async (event, fileName) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Lưu giấy chứng nhận',
    defaultPath: path.join(app.getPath('documents'), String(fileName || 'chung-nhan.pdf')),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (canceled || !filePath) return false;
  const pdf = await event.sender.printToPDF({ landscape: true, pageSize: 'A4', printBackground: true, preferCSSPageSize: true, margins: { marginType: 'none' } });
  await fs.writeFile(filePath, pdf);
  shell.showItemInFolder(filePath);
  return true;
});

app.whenReady().then(() => {
  // Only the microphone is needed (recording and speaking practice)
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => callback(permission === 'media'));
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => permission === 'media');

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
