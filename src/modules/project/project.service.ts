import { Injectable } from '@nestjs/common'
import projectCollect from '~/monogdb/models/project'

@Injectable()
export class ProjectService {
  constructor() {}

  async list() {
    const result = await projectCollect.find().exec()
    return result.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
  }

  async insertProject(data) {
    return projectCollect.create(data).then(() => 'insert project success')
  }

  async deleteProject(id: string) {
    return projectCollect.deleteOne({ _id: id })
  }
}
