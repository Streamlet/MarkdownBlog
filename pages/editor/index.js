var md = require('markdown-it')()

window.addEventListener('DOMContentLoaded', (e) => {
  const editor = document.getElementById('editor')
  const preview = document.getElementById('preview')
  const updatePreview = () => {
    preview.innerHTML = md.render(editor.value)
  }
  editor.addEventListener('keyup', updatePreview)
  editor.addEventListener('change', updatePreview)

  updatePreview()
})
