import { app, Menu, MenuItemConstructorOptions } from 'electron'
import * as editor from './cmd/editor'
import * as misc from './cmd/misc'
import * as publishing from './cmd/publishing'
import * as env from './env'

const isMac = env.platform === env.PLATFORMS.DARWIN

const template: MenuItemConstructorOptions[] = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'services' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'hide' as MenuItemConstructorOptions['role'] },
      { role: 'hideothers' as MenuItemConstructorOptions['role'] },
      { role: 'unhide' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'quit' as MenuItemConstructorOptions['role'] },
    ],
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Publish',
        click: async (menuItem, browserWindow, event) => {
          const activedEditor = editor.activedEditor()
          if (activedEditor) {
            const html = await editor.getEditorHtml(activedEditor) as string
            publishing.showWindow(activedEditor, html)
          }

        },
      },
      ...(isMac ? [
        { role: 'close' as MenuItemConstructorOptions['role'] },
      ] : [
          { role: 'quit' as MenuItemConstructorOptions['role'] },
        ]),
    ],
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' as MenuItemConstructorOptions['role'] },
      { role: 'redo' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'cut' as MenuItemConstructorOptions['role'] },
      { role: 'copy' as MenuItemConstructorOptions['role'] },
      { role: 'paste' as MenuItemConstructorOptions['role'] },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' as MenuItemConstructorOptions['role'] },
        { role: 'delete' as MenuItemConstructorOptions['role'] },
        { role: 'selectAll' as MenuItemConstructorOptions['role'] },
        { type: 'separator' as MenuItemConstructorOptions['type'] },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' as MenuItemConstructorOptions['role'] },
            { role: 'stopspeaking' as MenuItemConstructorOptions['role'] },
          ],
        },
      ] : [
          { role: 'delete' as MenuItemConstructorOptions['role'] },
          { type: 'separator' as MenuItemConstructorOptions['type'] },
          { role: 'selectAll' as MenuItemConstructorOptions['role'] },
        ]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' as MenuItemConstructorOptions['role'] },
      { role: 'forcereload' as MenuItemConstructorOptions['role'] },
      { role: 'toggledevtools' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'resetzoom' as MenuItemConstructorOptions['role'] },
      { role: 'zoomin' as MenuItemConstructorOptions['role'] },
      { role: 'zoomout' as MenuItemConstructorOptions['role'] },
      { type: 'separator' as MenuItemConstructorOptions['type'] },
      { role: 'togglefullscreen' as MenuItemConstructorOptions['role'] },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' as MenuItemConstructorOptions['role'] },
      { role: 'zoom' as MenuItemConstructorOptions['role'] },
      ...(isMac ? [
        { type: 'separator' as MenuItemConstructorOptions['type'] },
        { role: 'front' as MenuItemConstructorOptions['role'] },
        { type: 'separator' as MenuItemConstructorOptions['type'] },
        { role: 'window' as MenuItemConstructorOptions['role'] },
      ] : [
          { role: 'close' as MenuItemConstructorOptions['role'] },
        ]),
    ],
  },
  {
    role: 'help' as MenuItemConstructorOptions['role'],
    submenu: [
      {
        label: 'Website',
        click: (menuItem, browserWindow, event) => {
          misc.showWebSite()
        },
      },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)

export function createAppMenu() {
  Menu.setApplicationMenu(menu)
}
