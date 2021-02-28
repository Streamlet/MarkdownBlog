import { app, BrowserWindow } from 'electron'
import * as editor from './cmd/editor'
import * as menu from './menu'
// import * as env from './env'

app.whenReady().then(() => {
  editor.newWindow()
  menu.createAppMenu()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (env.platform !== env.PLATFORMS.DARWIN) {
  app.quit()
  // }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    editor.newWindow()
  }
})
