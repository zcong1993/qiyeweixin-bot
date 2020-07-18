export interface Options {
  key: string
  endpoint?: string
}

export interface Resp {
  errcode: number
  errmsg: string
}

export class ApiError extends Error {}

export interface TextMsg {
  msgtype: 'text'
  text: {
    content: string
    mentioned_list?: string[]
    mentioned_mobile_list?: string[]
  }
}

export interface MarkdownMsg {
  msgtype: 'markdown'
  markdown: {
    content: string
  }
}

export interface ImageMsg {
  msgtype: 'image'
  image: {
    base64: string
    md5: string
  }
}

export interface Article {
  title: string
  description: string
  url: string
  picurl: string
}

export interface NewsMsg {
  msgtype: 'news'
  news: {
    articles: Article[]
  }
}

export interface FileMsg {
  msgtype: 'file'
  file: {
    media_id: string
  }
}

export type Msg = TextMsg | MarkdownMsg | ImageMsg | NewsMsg | FileMsg
