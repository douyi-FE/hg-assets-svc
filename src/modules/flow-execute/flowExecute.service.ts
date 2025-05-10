import { Injectable } from '@nestjs/common'
import flowExecuteCollect from '~/monogdb/models/flow-execute'
import { workFlowService } from '~/work-flow'
import { ProcessInstanceStatus } from '~/work-flow/models/process-instance'

@Injectable()
export class FlowExecuteService {
  constructor() {}

  async list() {
    const list = await flowExecuteCollect.find()
    const formattedList = list.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
    return formattedList
  }

  async find(id: string) {
    const list = await flowExecuteCollect.findOne({
      _id: id,
    })
    return list
  }

  async save(id: string, name: string, xml: string, note: string) {
    const list = await flowExecuteCollect.find({
      _id: id,
    })
    if (list.length > 0) {
      return flowExecuteCollect.updateOne({
        _id: id,
      }, {
        name,
        xml,
        note,
      })
    }
    else {
      return flowExecuteCollect.create({
        name,
        xml,
        note,
      })
    }
  }

  async create(flowId: string, initiatorId: string, businessId: string, variables: any = {}) {
    return workFlowService.createFlow(flowId, variables, initiatorId).then((res: any) => {
      const { stateSnapshot, flowDesignId, instanceId, initiatorId, variables, status, tasks } = res
      return flowExecuteCollect.create({
        initiatorId,
        flowDesignId,
        businessId,
        instanceId,
        stateSnapshot,
        metadata: variables,
        status,
        tasks,
      })
    }).then((res: any) => {
      return res.toObject()
    })
  }

  async approve(businessId: string, initiatorId: string) {
    return flowExecuteCollect.findOne({
      businessId,
    }).then(async (res: any) => {
      const result: any = await workFlowService.approveFlow(res.instanceId)
      const { tasks, isRunning, state } = result
      if (result) {
        return flowExecuteCollect.updateOne({
          businessId,
        }, {
          status: isRunning ? ProcessInstanceStatus.RUNNING : ProcessInstanceStatus.COMPLETED,
          stateSnapshot: state,
          tasks,
          initiatorId,
        }).then((res: any) => {
          return {
            status: isRunning ? ProcessInstanceStatus.RUNNING : ProcessInstanceStatus.COMPLETED,
            tasks,
            stateSnapshot: state,
          }
        })
      }
      else {
        return Promise.reject(new Error('流程不存在'))
      }
    })
  }

  async reject(businessId: string, initiatorId: string) {
    return flowExecuteCollect.findOne({
      businessId,
    }).then((res: any) => {
      if (res.flowDesignId) {
        return Promise.all([
          flowExecuteCollect.updateOne({
            businessId,
          }, {
            status: ProcessInstanceStatus.TERMINATED,
            initiatorId,
          }),
          workFlowService.rejectFlow(res.instanceId),
        ])
      }
      else {
        return Promise.reject(new Error('流程不存在'))
      }
    })
  }

  async delete(id: string) {
    return flowExecuteCollect.deleteOne({
      _id: id,
    })
  }
}
