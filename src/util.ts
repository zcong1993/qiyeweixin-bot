import { promises as fs } from 'fs'
import { createHash } from 'crypto'

export const md5 = (bf: Buffer) => {
  const h = createHash('md5')
  h.update(bf)
  return h.digest('hex')
}

export const toBase64 = (bf: Buffer) => bf.toString('base64')

export const fileSize = async (path: string) => {
  const { size } = await fs.stat(path)
  return size
}

export const ensureFileSizeLess = async (path: string, maxSize: number) => {
  const size = await fileSize(path)
  if (size > maxSize) {
    throw new Error(`file size ${size} should less than ${maxSize}`)
  }
}
