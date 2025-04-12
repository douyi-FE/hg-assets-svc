import { Injectable } from '@nestjs/common'
import ApplicationDataCollect from '~/monogdb/models/application-data'

@Injectable()
export class ApplicationDataService {
  constructor() {}

  // 依据userId与templateId获取应用数据
  async getApplicationDataByUserId(query: any) {
    try {
      const results = await ApplicationDataCollect
        .find(query)
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      return results[0] ? results[0].toObject() : null
    }
    catch (error) {
      console.error('获取应用数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId新增应用数据
  async addApplicationData(userId: string, templateId: string, applicationData: any, deptId: number) {
    try {
      const data = {
        userId,
        deptId,
        templateId,
        applicationData,
        updateTime: new Date(),
      }
      return await ApplicationDataCollect.create(data).then((res) => {
        return 'success'
      })
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
