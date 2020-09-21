import { shell } from 'electron'

export function showWebSite () {
  shell.openExternal('https://www.streamlet.org')
}
