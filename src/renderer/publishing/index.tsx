import { IpcRendererEvent, ipcRenderer, remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import MetaWeblog from 'metaweblog-api'
import { ipcMsg } from '../../shared/ipc/ipc'

import './index.css'

let content: string | null = null
let blogApi: MetaWeblog | null = null
let blogId: string | null = null

ReactDOM.render(
  <React.StrictMode>
    <div>MetaWeblog API address</div>
    <input className="field" type="text" id="url" />
    <div>User name</div>
    <input className="field" type="text" id="username" />
    <div>Password</div>
    <input className="field" type="password" id="password" />
    <input disabled type="button" id="fetch-categories" value="Fetch categories" />
    <div id="categories-container"></div>
    <div>Title</div>
    <input className="field" type="text" id="title" />
    <input disabled type="button" id="publish" value="Publish" />
    <input type="button" id="close" value="Close" />
  </React.StrictMode>,
  document.getElementById('root'),
)

const getBlogApi = async function () {
  if (!blogApi) {
    blogApi = new MetaWeblog($('#url').val() as string)
  }
  if (!blogId) {
    let blogInfo : MetaWeblog.BlogInfo[]
    try {
      blogInfo = await blogApi.getUsersBlogs('', $('#username').val() as string, $('#password').val() as string)
    } catch (e) {
      blogApi = null
      blogId = null
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

const fetchCategories = async function () {
  console.log('fetching categories')
  if (!await getBlogApi()) {
    return
  }
  let categories: MetaWeblog.CategoryInfo[]
  try {
    categories = await (blogApi as MetaWeblog).getCategories(blogId as string, $('#username').val() as string, $('#password').val() as string)
  } catch (e) {
    blogApi = null
    blogId = null
    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'error',
      message: e.message,
    })
    return
  }
  $('#categories-container').empty()
  $('#categories-container').append(...categories.map(c => $('<label />')
    .append($('<input />').attr('type', 'checkbox').attr('group', 'categories').attr('class', 'categories').val(c.categoryid))
    .append(c.title)))
}

const publish = async function () {
  console.log('publishing')
  if (!await getBlogApi()) {
    return
  }
  const categoryIds :string[] = []
  $('#categories-container').find('.categories').each((i, e) => {
    if ($(e).prop('checked')) {
      categoryIds.push($(e).val() as string)
    }
  })

  try {
    await (blogApi as MetaWeblog).newPost(blogId as string, $('#username').val() as string, $('#password').val() as string, {
      dateCreated: new Date(),
      description: content as string,
      title: $('#title').val() as string,
      categories: categoryIds,
    }, true)
  } catch (e) {
    blogApi = null
    blogId = null
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

const checkBlogInfo = function () {
  if ($('#url').val() && $('#username').val() && $('#password').val()) {
    $('#fetch-categories').prop('disabled', false)
  } else {
    $('#fetch-categories').prop('disabled', true)
  }
}

const checkPublish = function () {
  if (blogId !== null && content !== null && $('#username').val() && $('#password').val() && $('#title').val()) {
    $('#publish').prop('disabled', false)
  } else {
    $('#publish').prop('disabled', true)
  }
}

ipcRenderer.on(ipcMsg.PUBLISHER_SET_HTML, (e: IpcRendererEvent, html: string) => {
  content = html
  checkPublish()
})

$(() => {
  $('#url').on('change keyup', checkBlogInfo)
  $('#username').on('change keyup', checkBlogInfo)
  $('#password').on('change keyup', checkBlogInfo)
  $('#password').on('change keyup', checkBlogInfo)
  $('#title').on('change keyup', checkPublish)

  $('#fetch-categories').on('click', fetchCategories)

  $('#publish').on('click', publish)
  $('#close').on('click', () => {
    window.close()
  })
})
