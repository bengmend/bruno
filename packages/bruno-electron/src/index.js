const path = require('path');
const isDev = require('electron-is-dev');
const { format } = require('url');
const { BrowserWindow, app, Menu } = require('electron');
const { setContentSecurityPolicy } = require('electron-util');
const { get } = require('lodash');

const menuTemplate = require('./app/menu-template');
const LastOpenedCollections = require('./store/last-opened-collections');
const { getPreferences } = require('./store/preferences');
const registerNetworkIpc = require('./ipc/network');
const registerCollectionsIpc = require('./ipc/collection');
const Watcher = require('./app/watcher');
const { loadWindowState, saveWindowState } = require('./utils/window');

const lastOpenedCollections = new LastOpenedCollections();

const preferences = getPreferences();

setContentSecurityPolicy(`
	default-src * 'unsafe-inline' 'unsafe-eval';
	script-src * 'unsafe-inline' 'unsafe-eval';
	connect-src * 'unsafe-inline';
	form-action 'none';
`);

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

let mainWindow;
let watcher;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  const { x, y, width, height } = loadWindowState();

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    },
    title: 'Bruno',
    icon: path.join(__dirname, 'about/256x256.png'),
    autoHideMenuBar: get(preferences, 'display.autoHideMenu', true)
  });

  const url = isDev
    ? 'http://localhost:3000'
    : format({
        pathname: path.join(__dirname, '../web/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(url);
  watcher = new Watcher();

  mainWindow.on('resize', () => saveWindowState(mainWindow));
  mainWindow.on('move', () => saveWindowState(mainWindow));

  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  // register all ipc handlers
  registerNetworkIpc(mainWindow, watcher, lastOpenedCollections);
  registerCollectionsIpc(mainWindow, watcher, lastOpenedCollections);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);
