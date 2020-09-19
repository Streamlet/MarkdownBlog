const { shell } = require('electron')

module.exports.showWebSite = function () {
  shell.openExternal('https://www.streamlet.org')
}
