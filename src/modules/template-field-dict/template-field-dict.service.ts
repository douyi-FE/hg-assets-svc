import { Injectable } from '@nestjs/common'
import TemplateFieldDictCollect from '~/monogdb/models/template-field-dict'

@Injectable()
export class TemplateFieldDictService {
  constructor() {}

  async getTemplateFieldDict(query: any) {
    try {
      const { templateId, templateCode } = query
      const results = await TemplateFieldDictCollect
        .find({ templateId })
        .sort({ updateTime: -1 })
        .exec()
      const dictData = results[0] ? results[0].toObject() : null
      if (dictData) {
        const { applicationData } = dictData
        if (applicationData) {
          const filteredDictData = applicationData.filter(item => item.templateCode === templateCode)
          return filteredDictData
        }
      }
      return []
    }
    catch (error) {
      console.error('获取模板字段字典数据失败:', error)
      throw error
    }
  }

  async addOrUpdateTemplateFieldDict(userId: string, templateId: string, applicationData: any, deptId: number) {
    try {
      const data = {
        userId,
        templateId,
        applicationData,
        deptId,
        updateTime: new Date(),
      }
      // 如果存在则更新，否则新增
      const result = await TemplateFieldDictCollect.findOneAndUpdate({ templateId }, data, { new: true, upsert: true })
      return result
    }
    catch (error) {
      console.error('新增或更新模板字段字典数据失败:', error)
      throw error
    }
  }
}
