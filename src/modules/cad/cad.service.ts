import { Injectable } from '@nestjs/common'
import CadCollect from '~/monogdb/models/cad'

@Injectable()
export class CadService {
  constructor() {}

  // 获取所有制图数据
  async getCadData(query: any) {
    const { name = '' } = query
    const result = await CadCollect.find({}, { name: 1, createdAt: 1, updatedAt: 1 }).where({ name: { $regex: name } }).exec()
    return result.map(item => item.toObject()).map((item: any) => {
      return {
        ...item,
        _id: item._id.buffer.toString('hex'),
      }
    })
  }

  // 新增制图
  async addCadData(cadData: any = {}) {
    const { projectName: name, excelEjs: ejs, cadFileUrl: cadPath } = cadData

    const result: any = await CadCollect.create({
      name,
      cadPath,
      ejs,
    })
    return {
      ...result.toObject(),
      _id: result._id.buffer.toString('hex'),
    }
  }

  // 更新制图
  async updateCadData(id: string, cadData: any) {
    const result = await CadCollect.findByIdAndUpdate(id, cadData, { new: false }).exec()
    return result ? result.toObject() : null
  }

  // 删除制图
  async deleteCadData(id: string) {
    const result = await CadCollect.deleteOne({ _id: id })
    return {
      code: 200,
      message: '删除成功',
      data: result,
    }
  }

  // 获取制图详情
  async getCadDataById(id: string) {
    const result = await CadCollect.findById(id).exec()
    return result ? result.toObject() : null
  }
}
