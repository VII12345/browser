const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');

const fs = require('fs');
const path = require('path');
const defaultPage = 'index.html';
const { exec } = require('child_process');



function createWindow(initialPage = defaultPage) {
  //Menu.setApplicationMenu(null); // 取消默认菜单栏
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public/11.jpg'), //图标
    webPreferences: {
      partition: 'persist:no-hsts-session',
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }

  });

  win.loadFile(initialPage);
}
app.commandLine.appendSwitch('remote-debugging-port', '12757');

app.commandLine.appendSwitch(
  'disable-features',
  'HttpsOnlyMode,UpgradeInsecureRequests,StrictMixedContentChecking'
);

app.commandLine.appendSwitch(
  'ignore-certificate-errors',
  'true'
);


app.whenReady().then(() => {
  const configFolder = path.join(app.getPath('userData'), 'configs');
  console.log('主进程启动成功，配置目录为:', configFolder);
  const Store = require("electron-store").default;
  const store = new Store();


  ipcMain.handle("auth-load", () => store.get("auth"));
  ipcMain.handle("auth-save", (event, auth) => store.set("auth", auth));
  ipcMain.handle("auth-clear", () => store.delete("auth"));

  ipcMain.handle("get-chrome-paths", () => {
    const exeDir = path.dirname(app.getPath("exe")); // exe 所在目录
    return {
      chromeDir: path.join(exeDir, "chromium"),        // CWD 下 chromium 文件夹
      dataDirBase: path.join(exeDir, "chromiumdata")   // CWD 下 fingerprint data
    };
  });
  ipcMain.handle("show-confirm", async (event, message) => {
    console.log("收到 show-confirm 调用！内容：", message);

    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    if (!win) {
      console.warn("未找到主窗口，无法显示弹窗");
      return false;
    }

    const result = await dialog.showMessageBox(win, {
      type: "question",
      buttons: ["确定", "取消"],
      defaultId: 0,
      cancelId: 1,
      message,
      title: "操作确认"
    });

    console.log("用户点击结果:", result.response);
    return result.response === 0;
  });


  ipcMain.handle('save-config', (event, { filename, data }) => {
    if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder, { recursive: true });
    const filePath = path.join(configFolder, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return filePath;
  });

  ipcMain.handle('get-config-files', () => {
    console.log('IPC get-config-files 被调用');
    if (!fs.existsSync(configFolder)) return [];
    return fs.readdirSync(configFolder).filter(file => file.endsWith('.json'));
  });

  ipcMain.handle('read-config-file', (event, filename) => {
    const filePath = path.join(configFolder, filename);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  });

  ipcMain.handle('delete-config-file', (event, filename) => {
    const filePath = path.join(configFolder, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return true;
  });



  ipcMain.handle('run-cmd', (event, command) => {
    return new Promise((resolve, reject) => {
      exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
        if (error) {
          console.error('CMD 执行出错:', error);
          return reject(stderr);
        }
        console.log('CMD 输出:', stdout);
        resolve(stdout);
      });
    });
  });

  createWindow(defaultPage);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(defaultPage);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
