module.exports = {
  EDITOR_GET_HTML: 'ipc_editor_get_html', // direction: main to renderer, param: /
  EDITOR_RETURN_HTML: 'ipc_editor_return_html', // direction: renderer to main, param: html

  PUBLISHER_SET_HTML: 'ipc_publisher_set_html', // direction: main to renderer, param: html
}
