import { promises as fs, createReadStream } from 'fs'
import axios from 'axios'
import * as FormData from 'form-data'
import {
  Options,
  Msg,
  Resp,
  ApiError,
  TextMsg,
  MarkdownMsg,
  ImageMsg,
  NewsMsg,
  FileMsg,
} from './types'
import { ensureFileSizeLess, toBase64, md5 } from './util'

const endpoint = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send'

export class Bot {
  constructor(private readonly options: Options) {
    if (!this.options.endpoint) {
      this.options.endpoint = endpoint
    }
  }

  async sendTextMsg(msg: TextMsg) {
    return this.send(msg)
  }

  async sendMarkdownMsg(msg: MarkdownMsg) {
    return this.send(msg)
  }

  async sendImageMsg(msg: ImageMsg) {
    return this.send(msg)
  }

  async sendNewsMsg(msg: NewsMsg) {
    return this.send(msg)
  }

  async sendFileMsg(msg: FileMsg) {
    return this.send(msg)
  }

  async sendImageFile(filePath: string) {
    // 2M max
    await ensureFileSizeLess(filePath, 2 << 1024)
    const f = await fs.readFile(filePath)
    const msg: ImageMsg = {
      msgtype: 'image',
      image: {
        md5: md5(f),
        base64: toBase64(f),
      },
    }
    return this.sendImageMsg(msg)
  }

  async sendFile(filePath: string, filename?: string) {
    const mediaId = await this.uploadMedia(filePath, filename)
    const msg: FileMsg = {
      msgtype: 'file',
      file: {
        media_id: mediaId,
      },
    }

    return this.sendFileMsg(msg)
  }

  async uploadMedia(filePath: string, filename?: string) {
    // 20M max
    await ensureFileSizeLess(filePath, 20 << 10)
    const form = new FormData()
    const f = createReadStream(filePath)
    let name: string

    if (filename) {
      name = filename
    } else {
      const tmp = filePath.split('/')
      name = tmp[tmp.length - 1]
    }

    form.append('media', f as any, name)

    const { data } = await axios.request({
      method: 'post',
      url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${this.options.key}&type=file`,
      data: form,
      headers: {
        ...form.getHeaders(),
      },
    })

    if (data.errcode !== 0) {
      throw new ApiError(data.errmsg)
    }

    return data.media_id
  }

  async send(msg: Msg) {
    const data = await this.rawSend(msg)

    if (data.errcode !== 0) {
      throw new ApiError(data.errmsg)
    }
  }

  async rawSend(msg: Msg) {
    const { data } = await axios.request<Resp>({
      method: 'post',
      url: this.buildUrl(),
      data: msg,
    })

    return data
  }

  private buildUrl() {
    const url = `${endpoint}?key=${this.options.key}`
    return url
  }
}
