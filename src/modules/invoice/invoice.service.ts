import { Injectable } from '@nestjs/common'
import { createProcessEngine } from '~/flow/bpmn'
import flowDesignCollect from '~/monogdb/models/flow-design'
import InvoiceCollect from '~/monogdb/models/invoice'

@Injectable()
export class InvoiceService {
  constructor() {}

  // 获取所有开票数据
  async getInvoiceData() {
    try {
      const result = await InvoiceCollect.find().exec()
      return result.map(item => item.toObject())
    }
    catch (error) {
      console.error('获取开票数据失败:', error)
      throw error
    }
  }

  // 依据项目编号获取开票数据
  async getInvoiceDataByProjectCode(query: any) {
    try {
      const result = await InvoiceCollect.findOne(query).exec()
      return result ? result.toObject() : null
    }
    catch (error) {
      console.error('获取开票数据失败:', error)
      throw error
    }
  }

  // 新增开票数据
  async addInvoiceData(applyCode: string, uid: string, invoiceData: any, status: string) {
    // 依据applyCode查询是否存在
    const exist = await InvoiceCollect.findOne({ applyCode }).exec()
    if (exist) {
      return InvoiceCollect.updateOne({ applyCode }, { $set: { uid, data: invoiceData, status } }).exec()
    }
    return InvoiceCollect.create({ applyCode, uid, data: invoiceData, status })
  }

  // 依据项目编码更新开票数据
  async updateInvoiceData(projectCode: string, invoiceData: any) {
    try {
      return await InvoiceCollect.updateOne(
        { projectCode },
        { $set: { invoiceData, updateTime: new Date() } },
      ).exec()
    }
    catch (error) {
      console.error('更新开票数据失败:', error)
      throw error
    }
  }

  // 依据项目编码删除开票数据
  async deleteInvoiceData(applyCode: string) {
    try {
      return await InvoiceCollect.deleteOne({ applyCode }).exec()
    }
    catch (error) {
      console.error('删除开票数据失败:', error)
      throw error
    }
  }

  // 提交发票申请，执行发票流程
  async applyInvoice(applyCode: string, flowId: string) {
    try {
      // 依据applyCode查询是否存在
      const exist = await InvoiceCollect.findOne({ applyCode }).exec()
      if (!exist) {
        throw new Error('开票数据不存在')
      }

      // 创建流程引擎
      const bpmnXmr = await flowDesignCollect.findOne({ _id: flowId }).exec()
      const { processId, currentNode } = await createProcessEngine(bpmnXmr.xml, exist.processId, exist.taskId).then((res) => {
        return res
      })

      return await InvoiceCollect.updateOne({ applyCode }, { $set: { status: 'pending', processId, taskId: currentNode.id } }).exec().then((res) => {
        return {
          ...res,
          applyCode,
          processId,
          taskId: currentNode.id,
        }
      })
    }
    catch (error) {
      console.error('提交发票申请失败:', error)
      throw error
    }
  }

  // 获取所有status为pending的发票申请
  async getPendingInvoiceApply() {
    try {
      const result = await InvoiceCollect.find({ status: 'pending' }).exec()
      return result.map(item => item.toObject())
    }
    catch (error) {
      console.error('获取所有status为pending的发票申请失败:', error)
      throw error
    }
  }
}
