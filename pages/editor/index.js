const { ipcRenderer } = require('electron')
const ipc = require('../../ipc/ipc.js')
const md = require('markdown-it')()

let editor, preview

const updatePreview = () => {
  preview.innerHTML = md.render(editor.value)
}

const onReady = function () {
  editor = document.getElementById('editor')
  preview = document.getElementById('preview')

  editor.addEventListener('keyup', updatePreview)
  editor.addEventListener('change', updatePreview)

  updatePreview()
}

window.addEventListener('DOMContentLoaded', onReady)

const onGetHtml = function () {
  return md.render(editor.value)
}
ipcRenderer.on(ipc.EDITOR_GET_HTML, () => {
  ipcRenderer.send(ipc.EDITOR_RETURN_HTML, onGetHtml())
})
