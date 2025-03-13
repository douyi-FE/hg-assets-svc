import { Injectable } from '@nestjs/common'
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
  async addInvoiceData(invoiceData: any) {
    try {
      return await InvoiceCollect.create(invoiceData)
    }
    catch (error) {
      console.error('新增开票数据失败:', error)
      throw error
    }
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
  async deleteInvoiceData(projectCode: string) {
    try {
      return await InvoiceCollect.deleteOne({ projectCode }).exec()
    }
    catch (error) {
      console.error('删除开票数据失败:', error)
      throw error
    }
  }
}
