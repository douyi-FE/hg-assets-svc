import { Injectable } from '@nestjs/common'
import UsersCollect from '~/monogdb/models/users'

@Injectable()
export class UsersService {
  constructor() {}

  async find(name: string) {
    const list = await UsersCollect.find({
      name,
    })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async save(name, sjs: any) {
    if (name) {
      return UsersCollect.updateOne({
        name,
      }, {
        sjs,
      })
    }
    else {
      return UsersCollect.create({
        sjs,
      })
    }
  }
}
