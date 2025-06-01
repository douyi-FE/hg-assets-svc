import { Injectable } from '@nestjs/common'
import JSZip from 'jszip'
import fileAttachsCollect from '~/monogdb/models/file-attachs'

@Injectable()
export class TemplateAttachService {
  constructor() { }

  async upload(file: any) {
    const result = await fileAttachsCollect.create({
      fileId: file.fileId,
      originalFileName: file.originalFileName,
      fileName: file.fileName,
      fileContent: file.fileContent,
      fileExtension: file.fileExtension,
      fileTime: file.fileTime,
      fileSize: file.fileSize,
    })
    return result
  }

  async download(fileId: string) {
    const file = await fileAttachsCollect.findOne({
      fileId,
    })
    return file
  }

  async delete(fileId: string) {
    return await fileAttachsCollect.deleteOne({
      fileId,
    })
  }

  async update(fileId: string, file: any) {
    return await fileAttachsCollect.updateOne({
      fileId,
    }, file)
  }

  async findByFileId(fileId: string) {
    return await fileAttachsCollect.find({
      fileId,
    })
  }

  // 根据 fileIds 查询附件，返回除 fileContent 外的附件信息
  async findByFileIds(fileIds: string[]) {
    return await fileAttachsCollect.find({
      fileId: { $in: fileIds },
    }, {
      fileContent: 0,
    })
  }

  async downloadZip(fileIds: string[]) {
    const files = await fileAttachsCollect.find({
      fileId: { $in: fileIds },
    })
    const zip = new JSZip()
    files.forEach((attachment) => {
      // fileContent 是 base64 编码的文件内容
      const fileContent = attachment.fileContent
      // 将 base64 编码的文件内容转换为 Buffer
      const fileBuffer = Buffer.from(fileContent, 'base64')
      // 直接将 Buffer 添加到 zip 中
      zip.file(attachment.originalFileName, fileBuffer)
    })
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    return zipBuffer
  }
}
