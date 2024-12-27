import { Injectable } from '@nestjs/common'
import builInCollect from '~/monogdb/models/builtin'

@Injectable()
export class BuiltInService {
  constructor() {}

  async find(name: string) {
    const list = await builInCollect.find({
      name,
    })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async save(name, sjs: any) {
    const list = await builInCollect.find({
      name,
    })
    if (list.length > 0) {
      return builInCollect.updateOne({
        name,
      }, {
        sjs,
      })
    }
    else {
      return builInCollect.create({
        name,
        sjs,
      })
    }
  }
}
