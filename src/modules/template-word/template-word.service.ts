import { Injectable } from '@nestjs/common'
import TemplateWordCollect from '~/monogdb/models/template-word'

@Injectable()
export class TemplateWordService {
  constructor() {}

  // word相关
  async list(parmas) {
    const list = await TemplateWordCollect.find(parmas)
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  // 获取word的ejs
  async word(id: string) {
    const word = await TemplateWordCollect.findById(id)
    return (word as any)._doc
  }

  async create(template: any) {
    const { name, code, note, status, isBuildIn, file, fileName } = template
    return TemplateWordCollect.create({
      name,
      code,
      note,
      status: Number(status),
      isBuildIn: isBuildIn === 'true',
      file,
      fileName,
    })
  }

  async update(id: string, data) {
    return TemplateWordCollect.updateOne({
      _id: id,
    }, data)
  }

  async remove(id: string) {
    const result = TemplateWordCollect.deleteOne({
      _id: id,
    })
    return {
      result,
    }
  }
}
