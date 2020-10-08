import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { ipcMsg } from '../../shared/ipc/ipc'
import Vditor from 'vditor'

import 'vditor/src/assets/scss/index.scss'
import './index.css'

let vditor: Vditor

const onReady = function () {
  vditor = new Vditor('editor')
}

window.addEventListener('DOMContentLoaded', onReady)

ReactDOM.render(
  <React.StrictMode>
    <div id="editor"></div>
  </React.StrictMode>,
  document.getElementById('root'),
)

const onGetHtml = function () {
  return vditor.getHTML()
}
ipcRenderer.on(ipcMsg.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipcMsg.EDITOR_RETURN_HTML, onGetHtml())
})
