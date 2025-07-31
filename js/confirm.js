async function showConfirm(message, title = "操作确认") {
    const { dialog, BrowserWindow } = require('electron');
    const win = BrowserWindow.getFocusedWindow(); // 当前窗口

    const result = await dialog.showMessageBox(win, {
        type: 'question',
        buttons: ['确定', '取消'],
        defaultId: 0,
        cancelId: 1,
        title,
        message
    });

    return result.response === 0;
}

module.exports = { showConfirm };
