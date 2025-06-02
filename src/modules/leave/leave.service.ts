import { Injectable } from '@nestjs/common'
import FlowExecuteCollect from '~/monogdb/models/flow-execute'
import LeaveCollect from '~/monogdb/models/leave'
import { FlowAuthUtil } from '~/utils/flow-auth.util'

@Injectable()
export class LeaveService {
  constructor(
    private readonly flowAuthUtil: FlowAuthUtil,
  ) {}

  // 获取所有请假数据
  async getLeaveData(userInfo: any) {
    const result = await LeaveCollect.find().exec()
    const flowExecute = await FlowExecuteCollect.find({ businessId: { $in: result.map((item: any) => item._id.buffer.toString('hex')) } }).exec()
    const list = result.map(item => item.toObject()).map((item: any) => {
      const _id = item._id.buffer.toString('hex')
      const flowExecuteData = (flowExecute.find((flowExecuteItem: any) => flowExecuteItem.businessId === _id) as any)?._doc || {}
      return { ...item, _id, flowExecute: flowExecuteData.tasks, initiatorId: flowExecuteData.initiatorId }
    })

    const resultList = []
    for (const item of list) {
      const hasPermission = await this.flowAuthUtil.hasNodeApprovalPermission(userInfo, item, item.flowExecute)
      item.hasPermission = hasPermission
      resultList.push(item)
    }
    return resultList
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
