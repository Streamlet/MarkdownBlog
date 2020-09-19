const { app, BrowserWindow } = require('electron')
const { editor } = require('./cmd/cmd.js')
const menu = require('./menu.js')
const env = require('./env.js')

app.whenReady().then(() => {
  editor.newWindow()
  menu.createAppMenu()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (env.platform !== env.PLATFORMS.DARWIN) {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    editor.newWindow()
  }
})
