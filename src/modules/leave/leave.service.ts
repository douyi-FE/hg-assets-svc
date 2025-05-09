import { Injectable } from '@nestjs/common'
import LeaveCollect from '~/monogdb/models/leave'

@Injectable()
export class LeaveService {
  constructor() {}

  // 获取所有请假数据
  async getLeaveData() {
    const result = await LeaveCollect.find().exec()
    return result.map(item => item.toObject()).map((item: any) => ({ ...item, _id: item._id.buffer.toString('hex') }))
  }

  // 新增请假
  async addLeaveData(leaveData: any) {
    const result: any = await LeaveCollect.create(leaveData)
    return {
      ...result.toObject(),
      _id: result._id.buffer.toString('hex'),
    }
  }

  // 更新请假
  async updateLeaveData(id: string, leaveData: any) {
    const result = await LeaveCollect.findByIdAndUpdate(id, leaveData).exec()
    return result ? result.toObject() : null
  }

  // 删除请假
  async deleteLeaveData(id: string) {
    const result = await LeaveCollect.deleteOne({ _id: id })
    return result
  }

  // 获取请假详情
  async getLeaveDataById(id: string) {
    const result = await LeaveCollect.findById(id).exec()
    return result ? result.toObject() : null
  }

  // 审批请假
  async approveLeaveData(id: string, approveData: any) {
    const result = await LeaveCollect.findByIdAndUpdate(id, approveData).exec()
    return result ? result.toObject() : null
  }

  // 驳回请假
  async rejectLeaveData(id: string) {
    const result = await LeaveCollect.findByIdAndUpdate(id, {
      approverStatus: 'reject',
    }).exec()
    return result ? result.toObject() : null
  }
}
