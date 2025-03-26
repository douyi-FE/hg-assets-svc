import { Injectable } from '@nestjs/common'
import templateDataCollect from '~/monogdb/models/template-data'

@Injectable()
export class TemplateDataService {
  constructor() {}

  async find() {
    const list = await templateDataCollect.find({}).exec()
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  // 创建
  async create(applicationName: string, templateId: string, templateName: string) {
    return await templateDataCollect.create({
      applicationName,
      templateId,
      templateName,
    }).catch((err) => {
      console.log('创建失败', err)
    })
  }

  // 更新
  async update(id: string, applicationName: string, templateId: string, templateName: string) {
    return await templateDataCollect.updateOne({
      _id: id,
    }, {
      applicationName,
      templateId,
      templateName,
    }).exec()
  }

  // 依据应用编码删除
  async delete(id: string) {
    return await templateDataCollect.deleteOne({
      _id: id,
    }).exec()
  }

  // 依据应用名查找模板-应用数据
  async findByApplicationName(applicationName: string) {
    const list = await templateDataCollect.find({
      applicationName,
    }).exec()

    // 如果找到数据，返回第一条记录，并格式化 _id
    if (list && list.length > 0) {
      const item: any = list[0]
      return {
        ...item._doc,
        _id: item._id.buffer.toString('hex'),
      }
    }

    // 没有找到数据，返回空对象
    return {}
  }
}
