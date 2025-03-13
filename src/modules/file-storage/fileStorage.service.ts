import fs from 'node:fs'
import path from 'node:path'
import { MultipartFile } from '@fastify/multipart'
import { Injectable, NotFoundException } from '@nestjs/common'
import dayjs from 'dayjs'

import { isNil } from 'lodash'
import {
  fileRename,
  getExtname,
  getFilePath,
  getFileType,
  saveLocalFile,
} from '~/utils/file.util'

@Injectable()
export class FileStorageService {
  constructor() {}

  /**
   * 保存文件上传记录
   */
  async saveFileStorage(file: MultipartFile, userId: number): Promise<string> {
    if (isNil(file))
      throw new NotFoundException('Have not any file to upload!')

    const fileName = file.filename
    const extName = getExtname(fileName)
    const type = getFileType(extName)
    const name = fileRename(fileName)
    const currentDate = dayjs().format('YYYY-MM-DD')
    const path = getFilePath(name, `${currentDate}/bussiness`, type)

    saveLocalFile(await file.toBuffer(), name, `${currentDate}/bussiness`, type)

    return path
  }

  //   删除文件
  async deleteFileStorage(filePath: string, userId: number) {
    const filePathString = path.join(__dirname, '../../../', 'public', filePath)

    return fs.unlink(filePathString, (err) => {
      if (err)
        throw err
    })
  }
}
