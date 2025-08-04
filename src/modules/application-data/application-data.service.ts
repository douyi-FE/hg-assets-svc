import { Injectable } from '@nestjs/common'
import ApplicationDataCollect from '~/monogdb/models/application-data'
import { addDataRowHideFields } from '~/utils/date.util'

@Injectable()
export class ApplicationDataService {
  constructor() { }

  // 依据userId与templateId获取应用数据
  async getApplicationDataByUserId(query: any) {
    try {
      const results = await ApplicationDataCollect
        .find(query)
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      return results[0]
        ? (results.map((item) => {
            return {
              ...item.toObject(),
              _id: item._id.toString(),
            }
          }))[0]
        : null
    }
    catch (error) {
      console.error('获取应用数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId新增应用数据
  async addApplicationData(userId: string, templateId: string, applicationData: any, deptId: number) {
    try {
      // 新增数据添加行id
      applicationData = addDataRowHideFields(applicationData)
      const data = {
        userId,
        deptId,
        templateId,
        applicationData,
        updateTime: new Date(),
      }
      // 先查询当前模板是否存在数据，存在则更新，不存在则新增
      const existingData = await ApplicationDataCollect.findOne({ templateId }).exec()
      if (existingData) {
        return await ApplicationDataCollect.updateOne({ _id: existingData._id }, { $set: data }).exec()
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

  /*
    applicationData 数据结构
    {
      "sheetName": {
        "tableName": [
          {}
        ]
      }
    }
    追加数据首先需要匹配 sheetName, 匹配后，把 table 数据合并到最新的数据中
  */

  // 追加数据
  async appendApplicationData(templateId: string, applicationData: any) {
    try {
      // 追加数据添加行id
      applicationData = addDataRowHideFields(applicationData)
      // 先查询最新的数据
      const latestData = await ApplicationDataCollect.findOne({ templateId }).sort({ updateTime: -1 }).exec()
      if (latestData) {
        // 把参数数据追加到最新的数据中
        const { applicationData: latestApplicationData } = latestData as any
        // 先匹配 sheetName
        Object.keys(applicationData).forEach((key) => {
          if (latestApplicationData[key]) {
            const tableKey = Object.keys(latestApplicationData[key]).find(item => item.startsWith('table'))
            if (tableKey) {
              latestApplicationData[key][tableKey] = [...latestApplicationData[key][tableKey], ...applicationData[key][tableKey]]
            }
          }
        })
        return await ApplicationDataCollect.updateOne({ templateId }, { $set: { applicationData: latestApplicationData, updateTime: new Date() } }).exec()
      }
      return await ApplicationDataCollect.create({ templateId, applicationData, updateTime: new Date() }).then((res) => {
        return 'success'
      })
    }
    catch (error) {
      console.error('追加数据失败:', error)
      throw error
    }
  }

  // 依据userId与templateId更新应用数据
  async updateApplicationData(userId: string, templateId: string, applicationData: any) {
    try {
      applicationData = addDataRowHideFields(applicationData)
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
        let { applicationData } = dictData
        if (typeof applicationData === 'string') {
          try {
            applicationData = JSON.parse(applicationData)
          }
          catch (error) {
            console.error('解析应用数据失败:', error)
            throw error
          }
        }
        if (applicationData) {
          let filteredDictData = []
          // 只取第一个sheet的数据
          const sheetName = Object.keys(applicationData)[0]
          if (sheetName) {
            const sheetData = applicationData[sheetName]
            Object.keys(sheetData).forEach((key) => {
              if (key.startsWith('table')) {
                filteredDictData = sheetData[key]
              }
            })
          }
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

  // 查询模板字段多列字典
  async getTemplateFieldMultiDict(query: any) {
    try {
      const { templateId, dictName } = query
      const results = await ApplicationDataCollect
        .find({ templateId })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const dictData = results[0] ? results[0].toObject() : null
      if (dictData) {
        let { applicationData } = dictData
        if (typeof applicationData === 'string') {
          try {
            applicationData = JSON.parse(applicationData)
          }
          catch (error) {
            console.error('解析应用数据失败:', error)
            throw error
          }
        }
        if (applicationData) {
          let filteredDictData = []
          // 只取第一个sheet的数据
          const sheetName = Object.keys(applicationData)[0]
          if (sheetName) {
            const sheetData = applicationData[sheetName]
            Object.keys(sheetData).forEach((key) => {
              if (key.startsWith('table')) {
                filteredDictData = sheetData[key]
              }
            })
          }
          if (filteredDictData) {
            if (dictName) {
              // 从 filteredDictData 数组中根据 ‘模板名称’ 属性过滤出对应的字典数据
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
      console.error('获取模板字段多列字典数据失败:', error)
      throw error
    }
  }
}
