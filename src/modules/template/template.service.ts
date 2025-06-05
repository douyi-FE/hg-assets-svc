import { Injectable } from '@nestjs/common'
import TemplateCollect from '~/monogdb/models/template'
import { addDataRowId } from '~/utils/date.util'

@Injectable()
export class TemplateService {
  constructor() {}

  // excel相关
  async list(parmas) {
    const list = await TemplateCollect.find(parmas)
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  // 依据ids获取模板列表
  async listByIds(ids: string[]) {
    const list = await TemplateCollect.find({ _id: { $in: ids } })
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  // 获取excel的ejs
  async excelEsj(id: string) {
    const ejs = await TemplateCollect.findById(id)
    return (ejs as any)._doc
  }

  async create(template: any) {
    let { name, code, note, status, isBuildIn, file, initDataSource } = template
    initDataSource = addDataRowId(initDataSource)
    return TemplateCollect.create({
      name,
      code,
      note,
      status: Number(status),
      isBuildIn: isBuildIn === 'true',
      file,
      initDataSource,
    })
  }

  async update(id: string, data) {
    if (data.initDataSource) {
      data.initDataSource = addDataRowId(data.initDataSource)
    }
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

  async publish(id: string) {
    return TemplateCollect.updateOne({
      _id: id,
    }, { $set: { status: 2 } })
  }
}
