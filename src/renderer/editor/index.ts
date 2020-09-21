import { ipcRenderer } from 'electron'
import markdownIt from 'markdown-it'
import {ipcMsg} from '../../shared/ipc/ipc'

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

const onGetHtml = function () {
  return md.render(editor.value)
}
ipcRenderer.on(ipcMsg.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipcMsg.EDITOR_RETURN_HTML, onGetHtml())
})
