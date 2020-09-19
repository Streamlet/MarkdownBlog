const { ipcRenderer, remote } = require('electron')
const MetaWeblog = require('metaweblog-api')
const ipc = require('../../ipc/ipc.js')

let url, username, password, fetchCategories, categoriesContainer, title, publish
let content
let blogApi, blogId

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
  const categories = categoriesContainer.getElementsByClassName('categories')
  const categoryIds = []
  for (const i in categories) {
    if (categories[i].checked) {
      categoryIds.push(categories[i].value)
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

  remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'info',
    message: 'Success!',
  })
}

const onReady = function () {
  url = document.getElementById('url')
  username = document.getElementById('username')
  password = document.getElementById('password')
  fetchCategories = document.getElementById('fetch-categories')
  categoriesContainer = document.getElementById('categories-container')
  title = document.getElementById('title')
  publish = document.getElementById('publish')

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
}

window.addEventListener('DOMContentLoaded', onReady)

const onSetHtml = function (e, html) {
  content = html
  checkPublish()
}

ipcRenderer.on(ipc.PUBLISHER_SET_HTML, onSetHtml)
