import { BrowserWindow } from 'electron'
import { ipcMsg } from '../../shared/ipc/ipc'

export function showWindow (parent: BrowserWindow, html: string) {
  const win = new BrowserWindow({
    title: 'Publish',
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
  win.loadFile('./build/renderer/publishing.html')
  win.webContents.on('did-finish-load', () => {
    win.webContents.send(ipcMsg.PUBLISHER_SET_HTML, html)
  })
}
