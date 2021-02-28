import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Vditor from 'vditor'
import { ipcMsg } from '../../shared/ipc/ipc'

import 'vditor/src/assets/scss/index.scss'
import '../shared/page.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <div id="editor"></div>
  </React.StrictMode>,
  document.getElementById('root'),
)

const vditor: Vditor = new Vditor('editor')

ipcRenderer.on(ipcMsg.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipcMsg.EDITOR_RETURN_HTML, vditor.getHTML())
})
