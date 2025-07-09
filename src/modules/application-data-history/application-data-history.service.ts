import { Injectable } from '@nestjs/common'
import ApplicationDataHistoryCollect from '~/monogdb/models/application-data-history'

@Injectable()
export class ApplicationDataHistoryService {
  constructor() { }

  // 依据applicationId获取应用数据历史版本
  async getApplicationHistoryList(query: any = {}) {
    try {
      const results = await ApplicationDataHistoryCollect
        .find(query)
        .sort({ updateTime: -1 })
        .select(['name', 'mark', 'createdAt', 'userId', 'applicationId'])
        .exec()
      return results.map((item) => {
        return {
          ...item.toObject(),
          _id: item._id.toString(),
        }
      })
    }
    catch (error) {
      console.error('获取应用数据历史版本失败:', error)
      throw error
    }
  }

  // 添加历史版本数据
  async addApplicationDataHistory(body: any) {
    const { tableKey, tableName, name, mark, applicationData, userId } = body
    const applicationDataHistory = await ApplicationDataHistoryCollect.create({ tableKey, tableName, name, mark, applicationData, userId }).then(() => '保存成功')
    return applicationDataHistory
  }

  // 删除历史版本数据
  async deleteApplicationDataHistory(id: string) {
    const applicationDataHistory = await ApplicationDataHistoryCollect.deleteOne({ _id: id }).then(() => '删除成功')
    return applicationDataHistory
  }

  // 获取历史版本数据详情
  async getApplicationDataHistoryDetail(id: string) {
    const applicationDataHistory = await ApplicationDataHistoryCollect.findById(id).then((item) => {
      return item.toObject()
    })
    return applicationDataHistory
  }

  // 依据id更新历史版本名称
  async updateApplicationDataHistoryName(id: string, name: string) {
    const applicationDataHistory = await ApplicationDataHistoryCollect.findByIdAndUpdate(id, { name }).then(() => '更新成功')
    return applicationDataHistory
  }
}
