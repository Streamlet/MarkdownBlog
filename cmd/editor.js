const { BrowserWindow } = require('electron')

module.exports.newWindow = function () {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadFile('./pages/editor/index.html')
}
