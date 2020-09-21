import { BrowserWindow, ipcMain } from 'electron'
import { ipcMsg } from '../ipc/ipc'

let theActivedEditor: BrowserWindow = null

export function newWindow () {
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
    theActivedEditor = win
  })
  win.on('blur', () => {
    if (theActivedEditor === win) {
      theActivedEditor = null
    }
  })
  win.loadFile('./pages/editor/index.html')
}

export function activedEditor () {
  return theActivedEditor
}

export function getEditorHtml (editor) {
  return new Promise((resolve, reject) => {
    editor.webContents.send(ipcMsg.EDITOR_GET_HTML)
    ipcMain.once(ipcMsg.EDITOR_RETURN_HTML, (e, html) => {
      resolve(html)
    })
  })
}
