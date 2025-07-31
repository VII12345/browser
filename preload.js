console.log('preload.js 开始执行');

try {
  const { contextBridge, ipcRenderer } = require('electron');
  console.log('Electron 模块已加载');

  const Store = require("electron-store").default;
  const store = new Store();


  contextBridge.exposeInMainWorld('electronAPI', {
    // 本地文件管理
    saveConfig: (filename, data) => ipcRenderer.invoke('save-config', { filename, data }),
    loadConfigs: () => ipcRenderer.invoke('get-config-files'),
    readConfig: (filename) => ipcRenderer.invoke('read-config-file', filename),
    deleteConfig: (filename) => ipcRenderer.invoke('delete-config-file', filename),
    runCmd: (command) => ipcRenderer.invoke('run-cmd', command),
    confirm: (message) => ipcRenderer.invoke("show-confirm", message),
    testHandler: () => ipcRenderer.invoke("test-handler"),
    getChromePaths: () => ipcRenderer.invoke("get-chrome-paths"),
    // 登录状态（本地 electron-store）
    getUser: () => store.get("auth"),
    saveUser: (auth) => store.set("auth", auth),
    clearUser: () => store.delete("auth")
  });

  console.log('electronAPI 已成功暴露');
} catch (err) {
  console.error('preload.js 执行出错:', err);
}
