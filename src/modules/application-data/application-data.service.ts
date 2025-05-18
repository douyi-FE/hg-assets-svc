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

  // 追加数据
  async appendApplicationData(userId: string, templateId: string, applicationData: any) {
    try {
      // 先查询最新的数据
      const latestData = await ApplicationDataCollect.findOne({ templateId }).sort({ updateTime: -1 }).exec()
      if (latestData) {
        // 把参数数据追加到最新的数据中
        const { applicationData: latestApplicationData } = latestData as any
        const tableData = Object.keys(latestApplicationData).find(key => key.startsWith('table'))
        if (tableData) {
          latestApplicationData[tableData] = [...latestApplicationData[tableData], ...applicationData]
        }
        return await ApplicationDataCollect.updateOne({ templateId }, { $set: { applicationData: latestApplicationData, updateTime: new Date() } }).exec()
      }
      return await ApplicationDataCollect.create({ templateId, applicationData, updateTime: new Date() })
    }
    catch (error) {
      console.error('追加数据失败:', error)
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

  // 查询模板字段字典
  async getTemplateFieldDict(query: any) {
    try {
      const { templateId, dictName } = query
      const results = await ApplicationDataCollect
        .find({ templateId })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const dictData = results[0] ? results[0].toObject() : null
      if (dictData) {
        const { applicationData } = dictData
        if (applicationData) {
          let filteredDictData = []
          Object.keys(applicationData).forEach((key) => {
            if (key.startsWith('table')) {
              filteredDictData = applicationData[key]
            }
          })
          if (filteredDictData) {
            if (dictName) {
              // 从 filteredDictData 数组中根据 ‘table_name’ 属性过滤出对应的字典数据
              const dictData = filteredDictData.filter((item: any) => {
                return item['模板名称'] === dictName
              })
              return dictData
            }
            return filteredDictData
          }
        }
      }
      return []
    }
    catch (error) {
      console.error('获取模板字段字典数据失败:', error)
      throw error
    }
  }
}
