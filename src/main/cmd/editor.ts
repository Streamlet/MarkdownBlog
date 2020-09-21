import { BrowserWindow, ipcMain } from 'electron'
import { ipcMsg } from '../../shared/ipc/ipc'

let theActivedEditor: BrowserWindow | null = null

export function newWindow() {
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
  win.loadFile('./src/renderer/editor/index.html')
}

export function activedEditor() {
  return theActivedEditor
}

export function getEditorHtml(editor: BrowserWindow) {
  return new Promise((resolve, reject) => {
    editor.webContents.send(ipcMsg.EDITOR_GET_HTML)
    ipcMain.once(ipcMsg.EDITOR_RETURN_HTML, (e, html) => {
      resolve(html)
    })
  })
}
