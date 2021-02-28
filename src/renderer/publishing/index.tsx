import { IpcRendererEvent, ipcRenderer, remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import MetaWeblog from 'metaweblog-api'
import { Form, Input, Button, Select, Space } from 'antd'
import { OptionsType, OptionData, OptionGroupData } from 'rc-select/lib/interface'
import { ipcMsg } from '../../shared/ipc/ipc'

import 'antd/dist/antd.css'
import '../shared/page.css'
import './index.css'

let content: string

type Category = {
  value: string
  label: string
}

type PublishingProps = {

}

type PublishingState = {
  blogApi: MetaWeblog | null
  blogId: string
  blogUrl: string
  blogUserName: string
  blogPassword: string
  enableFetchCategories: boolean
  fetchedCategories: Category[]
  selectedCategoryNames: string[]
  blogTitle: string
  enablePublish: boolean
}

class PublishingComponent extends React.Component<PublishingProps, PublishingState> {
  constructor (props: PublishingProps) {
    super(props)
    this.state = {
      blogApi: null,
      blogId: '',
      blogUrl: '',
      blogUserName: '',
      blogPassword: '',
      enableFetchCategories: false,
      fetchedCategories: [],
      selectedCategoryNames: [],
      blogTitle: '',
      enablePublish: false,
    }
    this.onBlogUrlChange = this.onBlogUrlChange.bind(this)
    this.onBlogUserNameChange = this.onBlogUserNameChange.bind(this)
    this.onBlogPasswordChange = this.onBlogPasswordChange.bind(this)
    this.fetchCategories = this.fetchCategories.bind(this)
    this.onCategoriesChanged = this.onCategoriesChanged.bind(this)
    this.onBlogTitleChange = this.onBlogTitleChange.bind(this)
    this.publish = this.publish.bind(this)
    this.close = this.close.bind(this)
  }

  render () {
    return <React.StrictMode>
      <Form>
        <Form.Item label="MetaWeblog API address" name="url" rules={[{ required: true }]}>
          <Input value={this.state.blogUrl} onChange={this.onBlogUrlChange} />
        </Form.Item>
        <Form.Item label="User name" name="username" id="username" rules={[{ required: true }]}>
          <Input value={this.state.blogUserName} onChange={this.onBlogUserNameChange} />
        </Form.Item>
        <Form.Item label="Password" name="password" id="password" rules={[{ required: true }]}>
          <Input.Password value={this.state.blogPassword} onChange={this.onBlogPasswordChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" disabled={!this.state.enableFetchCategories} onClick={this.fetchCategories}>Fetch categories</Button>
        </Form.Item>
        <Form.Item label="Categories" name="categories">
          <Select mode="multiple" options={this.state.fetchedCategories} onChange={this.onCategoriesChanged}>
          </Select>
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input value={this.state.blogTitle} onChange={this.onBlogTitleChange} />
        </Form.Item>
        <Form.Item >
          <Space>
            <Button type="primary" disabled={!this.state.enablePublish} onClick={this.publish}>Publish</Button>
            <Button onClick={this.close}>Close</Button>
          </Space>
        </Form.Item>
      </Form>
    </React.StrictMode>
  }

  async checkBlogInfo () {
    await this.setState({
      enableFetchCategories: !!(this.state.blogUrl && this.state.blogUserName && this.state.blogPassword),
    })
  }

  async checkPublish () {
    await this.setState({
      enablePublish: !!(this.state.blogId && content && this.state.blogUserName && this.state.blogPassword && this.state.blogTitle),
    })
  }

  async onBlogUrlChange (e: React.ChangeEvent<HTMLInputElement>) {
    await this.setState({
      blogUrl: e.target.value,
    })
    this.checkBlogInfo()
    this.checkPublish()
  }

  async onBlogUserNameChange (e: React.ChangeEvent<HTMLInputElement>) {
    await this.setState({
      blogUserName: e.target.value,
    })
    this.checkBlogInfo()
    this.checkPublish()
  }

  async onBlogPasswordChange (e: React.ChangeEvent<HTMLInputElement>) {
    await this.setState({
      blogPassword: e.target.value,
    })
    this.checkBlogInfo()
    this.checkPublish()
  }

  async onCategoriesChanged (value: string, option: OptionsType | OptionData | OptionGroupData) {
    await this.setState({
      selectedCategoryNames: option.map((item: OptionData) => {
        return item.label as string
      }),
    })
  }

  async onBlogTitleChange (e: React.ChangeEvent<HTMLInputElement>) {
    await this.setState({
      blogTitle: e.target.value,
    })
    this.checkBlogInfo()
    this.checkPublish()
  }

  async blogApiError (e: any) {
    await this.setState({
      blogApi: null,
      blogId: '',
    })
    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'error',
      message: e.message,
    })
  }

  async getBlogApi () {
    if (!this.state.blogApi) {
      await this.setState({
        blogApi: new MetaWeblog(this.state.blogUrl),
      })
    }
    if (!this.state.blogId) {
      let blogInfo: MetaWeblog.BlogInfo[]
      try {
        blogInfo = await this.state.blogApi!.getUsersBlogs('', this.state.blogUserName, this.state.blogPassword)
      } catch (e) {
        await this.blogApiError(e)
        return false
      }
      await this.setState({
        blogId: blogInfo[0].blogid,
      })
    }
    return true
  }

  async fetchCategories () {
    console.log('fetching categories')
    if (!await this.getBlogApi()) {
      return
    }
    let categories: MetaWeblog.CategoryInfo[]
    try {
      categories = await this.state.blogApi!.getCategories(this.state.blogId, this.state.blogUserName, this.state.blogPassword)
    } catch (e) {
      await this.blogApiError(e)
      return
    }
    await this.setState({
      fetchedCategories: categories.map((item) => {
        return {
          value: item.categoryid,
          label: item.title,
        }
      }),
    })
  }

  async publish () {
    console.log('publishing')
    if (!await this.getBlogApi()) {
      return
    }
    try {
      await (this.state.blogApi as MetaWeblog).newPost(this.state.blogId as string, this.state.blogUserName, this.state.blogPassword, {
        dateCreated: new Date(),
        description: content as string,
        title: this.state.blogTitle,
        categories: this.state.selectedCategoryNames,
      }, true)
    } catch (e) {
      await this.blogApiError(e)
      return
    }

    await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'info',
      message: 'Success!',
    })

    this.close()
  }

  close () {
    window.close()
  }
}

const refPublishingComponent: React.Ref<PublishingComponent> = React.createRef()

ReactDOM.render(
  <PublishingComponent ref={refPublishingComponent} />,
  document.getElementById('root'),
)

ipcRenderer.on(ipcMsg.PUBLISHER_SET_HTML, (e: IpcRendererEvent, html: string) => {
  content = html
  refPublishingComponent.current!.checkPublish()
})
