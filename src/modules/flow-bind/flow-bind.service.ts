import { Injectable } from '@nestjs/common'
import FlowBindCollect from '~/monogdb/models/flow-bind'

@Injectable()
export class FlowBindService {
  constructor() {}

  // 获取所有流程绑定数据
  async getFlowBindData(params: any) {
    const result = await FlowBindCollect.find(params).exec()
    return result.map(item => item.toObject()).map((item: any) => ({ ...item, _id: item._id.buffer.toString('hex') }))
  }

  // 新增流程绑定
  async addFlowBindData(flowBindData: any) {
    const result = await FlowBindCollect.create(flowBindData)
    return result.toObject()
  }

  // 删除流程绑定
  async deleteFlowBindData(id: string) {
    const result = await FlowBindCollect.deleteOne({ _id: id })
    return result
  }

  // 获取流程绑定详情
  async getFlowBindDataById(id: string) {
    const result = await FlowBindCollect.findById(id).exec()
    return result ? result.toObject() : null
  }

  // 更新流程绑定
  async updateFlowBindData(flowBindData: any) {
    const result = await FlowBindCollect.findByIdAndUpdate(flowBindData._id, flowBindData).exec()
    return result ? result.toObject() : null
  }
}
