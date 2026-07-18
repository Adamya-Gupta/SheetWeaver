const { app, BrowserWindow } = require('electron');
const path = require('path');

let appServe;

// We wrap initialization in an async function to support modern ESM packages
async function startApp() {
  if (app.isPackaged) {
    // 1. Dynamically import electron-serve (required for v3.0+)
    const serveModule = await import('electron-serve');
    const serve = serveModule.default; // Extract the default export
    
    appServe = serve({ directory: path.join(__dirname, 'out') });
  }

  // 2. Wait for Electron to be fully ready
  await app.whenReady();

  // 3. Create the window
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 4. Load the content
  if (app.isPackaged) {
    // Production: Load the static Next.js export
    appServe(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    // Development: Load the Next.js development server
    win.loadURL('http://localhost:3000');
  }
}

// Boot the app
startApp();

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});