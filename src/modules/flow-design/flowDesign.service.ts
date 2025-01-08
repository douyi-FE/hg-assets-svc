import { Injectable } from '@nestjs/common'
import flowDesignCollect from '~/monogdb/models/flow-design'

@Injectable()
export class FlowDesignService {
  constructor() {}

  async list(name: string) {
    const list = await flowDesignCollect.find({
      name: {
        $regex: name,
      },
    })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async find(id: string) {
    const list = await flowDesignCollect.find({
      _id: id,
    })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async save(id: string, name: string, xml: string, note: string) {
    const list = await flowDesignCollect.find({
      _id: id,
    })
    if (list.length > 0) {
      return flowDesignCollect.updateOne({
        _id: id,
      }, {
        name,
        xml,
        note,
      })
    }
    else {
      return flowDesignCollect.create({
        name,
        xml,
        note,
      })
    }
  }

  async delete(id: string) {
    return flowDesignCollect.deleteOne({
      _id: id,
    })
  }
}
