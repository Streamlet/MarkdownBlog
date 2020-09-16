var md = require('markdown-it')();

window.addEventListener('DOMContentLoaded', (e) => {
  let editor = document.getElementById("editor")
  let preview = document.getElementById("preview")
  let updatePreview = () => {
    preview.innerHTML = md.render(editor.value)
  }
  editor.addEventListener("keyup", updatePreview)
  editor.addEventListener("change", updatePreview)

  updatePreview();
})
