import { Injectable } from '@nestjs/common'
import ApplicationDataCollect from '~/monogdb/models/application-data'

@Injectable()
export class ApplicationDataService {
  constructor() {}

  // 依据userId与templateId获取应用数据
  async getApplicationDataByUserId(query: any) {
    try {
      const result = await ApplicationDataCollect.findOne(query).exec()
      return result ? result.toObject() : null
    }
    catch (error) {
      console.error('获取应用数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId新增应用数据
  async addApplicationData(userId: string, templateId: string, applicationData: any) {
    try {
      const data = {
        userId,
        templateId,
        applicationData,
        updateTime: new Date(),
      }
      return await ApplicationDataCollect.create(data)
    }
    catch (error) {
      console.error('新增应用数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId更新应用数据
  async updateApplicationData(userId: string, templateId: string, applicationData: any) {
    try {
      return await ApplicationDataCollect.updateOne(
        { userId, templateId },
        { $set: { applicationData, updateTime: new Date() } },
      ).exec()
    }
    catch (error) {
      console.error('更新应用数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId删除应用数据
  async deleteApplicationData(userId: string, templateId: string) {
    try {
      return await ApplicationDataCollect.deleteOne({ userId, templateId }).exec()
    }
    catch (error) {
      console.error('删除应用数据失败:', error)
      throw error
    }
  }
}
