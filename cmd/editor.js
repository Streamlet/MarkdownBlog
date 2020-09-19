const { BrowserWindow, ipcMain } = require('electron')
const ipc = require('../ipc/ipc.js')

let activedEditor = null

module.exports.newWindow = function () {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  })
  win.maximize()
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('focus', () => {
    activedEditor = win
  })
  win.on('blur', () => {
    if (activedEditor === win) {
      activedEditor = null
    }
  })
  win.loadFile('./pages/editor/index.html')
}

module.exports.activedEditor = function () {
  return activedEditor
}

module.exports.getEditorHtml = function (editor) {
  return new Promise((resolve, reject) => {
    editor.webContents.send(ipc.EDITOR_GET_HTML)
    ipcMain.once(ipc.EDITOR_RETURN_HTML, (e, html) => {
      resolve(html)
    })
  })
}
