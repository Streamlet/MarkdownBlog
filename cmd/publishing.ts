import { BrowserWindow } from 'electron'
import { ipcMsg } from '../ipc/ipc'

export function showWindow (parent, html) {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    parent: parent,
    modal: true,
    show: false,
    resizable: false,
    minimizable: false,
    width: 600,
    height: 400,
  })
  win.setMenu(null)
  win.once('ready-to-show', () => {
    win.show()
  })
  win.loadFile('./pages/publishing/index.html')
  win.webContents.on('did-finish-load', () => {
    win.webContents.send(ipcMsg.PUBLISHER_SET_HTML, html)
  })
}
