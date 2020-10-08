import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Vditor from 'vditor'
import { ipcMsg } from '../../shared/ipc/ipc'

import 'vditor/src/assets/scss/index.scss'
import './index.css'

let vditor: Vditor

ReactDOM.render(
  <React.StrictMode>
    <div id="editor"></div>
  </React.StrictMode>,
  document.getElementById('root'),
)

ipcRenderer.on(ipcMsg.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipcMsg.EDITOR_RETURN_HTML, vditor.getHTML())
})

$(() => {
  vditor = new Vditor('editor')
})
