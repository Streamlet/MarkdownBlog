import { ipcRenderer } from 'electron'
import React from 'react';
import ReactDOM from 'react-dom';
import markdownIt from 'markdown-it'
import { ipcMsg } from '../../shared/ipc/ipc'

import './index.css'

const md = markdownIt()
let editor: HTMLTextAreaElement, preview: HTMLDivElement

const updatePreview = () => {
  preview.innerHTML = md.render(editor.value)
}

const onReady = function () {
  editor = document.getElementById('editor') as HTMLTextAreaElement
  preview = document.getElementById('preview') as HTMLDivElement

  editor.addEventListener('keyup', updatePreview)
  editor.addEventListener('change', updatePreview)

  updatePreview()
}

window.addEventListener('DOMContentLoaded', onReady)

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <textarea id="editor"></textarea>
      <div id="preview"></div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)

const onGetHtml = function () {
  return md.render(editor.value)
}
ipcRenderer.on(ipcMsg.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipcMsg.EDITOR_RETURN_HTML, onGetHtml())
})
