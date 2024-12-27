import { Injectable } from '@nestjs/common'
import templateDataCollect from '~/monogdb/models/template-data'

@Injectable()
export class TemplateDataService {
  constructor() {}

  async find(code: string) {
    const list = await templateDataCollect.find({
      code,
    })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async save(code: string, name: string, record: Map<string, any>) {
    const list = await templateDataCollect.find({
      code,
    })
    if (list.length > 0) {
      return templateDataCollect.updateOne({
        code,
      }, {
        record,
      })
    }
    else {
      return templateDataCollect.create({
        name,
        code,
        record,
      })
    }
  }
}
