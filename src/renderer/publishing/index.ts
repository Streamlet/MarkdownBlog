import { ipcRenderer, remote } from 'electron'
import MetaWeblog from 'metaweblog-api'
import { ipcMsg } from '../../shared/ipc/ipc'

let url: HTMLInputElement, username: HTMLInputElement, password: HTMLInputElement, fetchCategories: HTMLInputElement, categoriesContainer: HTMLDivElement, title: HTMLInputElement, publish: HTMLInputElement, close: HTMLInputElement
let content: string
let blogApi: MetaWeblog, blogId: string

const getBlogApi = async function () {
  if (!blogApi) {
    blogApi = new MetaWeblog(url.value)
  }
  if (!blogId) {
    let blogInfo
    try {
      blogInfo = await blogApi.getUsersBlogs('', username.value, password.value)
    } catch (e) {
      remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'error',
        message: e.message,
      })
      return false
    }
    blogId = blogInfo[0].blogid
  }
  return true
}

const checkBlogInfo = function () {
  if (url.value && username.value && password.value) {
    fetchCategories.removeAttribute('disabled')
  } else {
    fetchCategories.setAttribute('disabled', '')
  }
}

const onFetchCategories = async function () {
  if (!await getBlogApi()) {
    return
  }
  let categories
  try {
    categories = await blogApi.getCategories(blogId, username.value, password.value)
  } catch (e) {
    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'error',
      message: e.message,
    })
    return
  }
  const html = categories.map(c => '<label><input type="checkbox" group="categories" class="categories" value=' + c.categoryid + '>' + c.title + '</label>').join('\n')
  categoriesContainer.innerHTML = html
}

const checkPublish = function () {
  if (blogId && username.value && password.value && title.value && typeof content === 'string') {
    publish.removeAttribute('disabled')
  } else {
    publish.setAttribute('disabled', '')
  }
}

const onPublish = async function () {
  if (!await getBlogApi()) {
    return
  }
  const categories = categoriesContainer.getElementsByClassName('categories') as HTMLCollection
  const categoryIds = []
  for (const i in categories) {
    if ((categories[i] as HTMLInputElement).checked) {
      categoryIds.push((categories[i] as HTMLInputElement).value)
    }
  }

  try {
    await blogApi.newPost(blogId, username.value, password.value, {
      dateCreated: new Date(),
      description: content,
      title: title.value,
      categories: categoryIds,
    }, true)
  } catch (e) {
    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'error',
      message: e.message,
    })
    return
  }

  await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'info',
    message: 'Success!',
  })

  window.close()
}
const onClose = function () {
  window.close()
}

const onReady = function () {
  url = document.getElementById('url') as HTMLInputElement
  username = document.getElementById('username') as HTMLInputElement
  password = document.getElementById('password') as HTMLInputElement
  fetchCategories = document.getElementById('fetch-categories') as HTMLInputElement
  categoriesContainer = document.getElementById('categories-container') as HTMLDivElement
  title = document.getElementById('title') as HTMLInputElement
  publish = document.getElementById('publish') as HTMLInputElement
  close = document.getElementById('close') as HTMLInputElement

  url.addEventListener('change', checkBlogInfo)
  url.addEventListener('keyup', checkBlogInfo)
  username.addEventListener('change', checkBlogInfo)
  username.addEventListener('keyup', checkBlogInfo)
  password.addEventListener('change', checkBlogInfo)
  password.addEventListener('keyup', checkBlogInfo)

  fetchCategories.addEventListener('click', onFetchCategories)

  title.addEventListener('change', checkPublish)
  title.addEventListener('keyup', checkPublish)

  publish.addEventListener('click', onPublish)
  close.addEventListener('click', onClose)
}

window.addEventListener('DOMContentLoaded', onReady)

const onSetHtml = function (e: Electron.IpcRendererEvent, html: string) {
  content = html
  checkPublish()
}

ipcRenderer.on(ipcMsg.PUBLISHER_SET_HTML, onSetHtml)
