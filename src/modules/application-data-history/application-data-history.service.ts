import { Injectable } from '@nestjs/common'
import ApplicationDataHistoryCollect from '~/monogdb/models/application-data-history'
import { compressData, decompressData, getJsonSizeMB } from '~/utils/mongodb.util'

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

  // 依据ID和查询条件模糊检索历史版本数据
  async getApplicationHistoryListByID(query: any = {}) {
    try {
      const results = await ApplicationDataHistoryCollect
        .find({
          $or: [
            { _id: query.id },
            { name: { $regex: query.name, $options: 'i' } },
          ],
        })
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
      console.error('依据ID和查询条件模糊检索历史版本数据失败:', error)
      throw error
    }
  }

  // 添加历史版本数据
  async addApplicationDataHistory(body: any) {
    try {
      const { tableKey, tableName, name, mark, applicationData, userId, ejs } = body

      // 检查应用数据的大小，如果超过10MB则压缩
      const jsonSize = getJsonSizeMB(applicationData)
      let processedApplicationData = applicationData

      if (jsonSize > 10) {
        // 压缩应用数据
        processedApplicationData = await compressData(applicationData)
      }

      const applicationDataHistory = await ApplicationDataHistoryCollect.create({
        tableKey,
        tableName,
        name,
        mark,
        applicationData: processedApplicationData,
        userId,
        ejs,
      }).then(() => '保存成功')

      return applicationDataHistory
    }
    catch (error) {
      console.error('添加历史版本数据失败:', error)
      throw error
    }
  }

  // 删除历史版本数据
  async deleteApplicationDataHistory(id: string) {
    const applicationDataHistory = await ApplicationDataHistoryCollect.deleteOne({ _id: id }).then(() => '删除成功')
    return applicationDataHistory
  }

  // 获取历史版本数据详情
  async getApplicationDataHistoryDetail(id: string) {
    try {
      const applicationDataHistory = await ApplicationDataHistoryCollect.findById(id).then((item) => {
        return item.toObject()
      })

      // 检查应用数据是否被压缩，如果是则解压缩
      if (applicationDataHistory && applicationDataHistory.applicationData
        && typeof applicationDataHistory.applicationData === 'object'
        && applicationDataHistory.applicationData.buffer
        && (applicationDataHistory.applicationData.buffer instanceof Buffer
          || applicationDataHistory.applicationData.buffer instanceof Uint8Array
          || (applicationDataHistory.applicationData.buffer && typeof applicationDataHistory.applicationData.buffer === 'object'))) {
        try {
          applicationDataHistory.applicationData = await decompressData(applicationDataHistory.applicationData)
        }
        catch (error) {
          console.error('解压缩应用数据失败:', error)
        }
      }

      return applicationDataHistory
    }
    catch (error) {
      console.error('获取历史版本数据详情失败:', error)
      throw error
    }
  }

  // 依据id更新历史版本名称
  async updateApplicationDataHistoryName(id: string, name: string) {
    const applicationDataHistory = await ApplicationDataHistoryCollect.findByIdAndUpdate(id, { name }).then(() => '更新成功')
    return applicationDataHistory
  }
}
