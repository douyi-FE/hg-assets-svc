import { Injectable } from '@nestjs/common'
import TemplateCollect from '~/monogdb/models/template'

@Injectable()
export class TemplateService {
  constructor(
  ) {}

  // excel相关
  async list(parmas) {
    const list = await TemplateCollect.find(parmas)
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async create(template: any) {
    const { name, note, status, isBuildIn, file } = template
    return TemplateCollect.create({
      name,
      note,
      status: Number(status),
      isBuildIn: isBuildIn === 'true',
      file,
    })
  }

  async update(id: string, data) {
    return TemplateCollect.updateOne({
      _id: id,
    }, data)
  }

  async remove(id: string) {
    const result = TemplateCollect.deleteOne({
      _id: id,
    })
    return {
      result,
    }
  }

  // word相关
  async word(params) {
    return [
      {
        name: 'dffff',
      },
    ]
  }
}
