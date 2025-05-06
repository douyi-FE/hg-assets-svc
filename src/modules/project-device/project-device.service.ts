import { Injectable } from '@nestjs/common'
import { cloneDeep } from 'lodash'
import ProjectDeviceCollect from '~/monogdb/models/project-device'
import { getSummaryData, summaryConfig } from './summary-config'

@Injectable()
export class ProjectDeviceService {
  constructor() { }

  // 根据userId, type, project, device, engineer 获取项目设备数据
  // 先查出userId 对应的数据，再查出所有数据，分成两个属性保存并返回
  async getProjectDeviceData(query: any) {
    try {
      const { userId, type, project, device, engineer } = query
      const resultsWithUserId = await ProjectDeviceCollect
        .find({ userId, type, project, device, engineer })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const projectDeviceWithUserId = resultsWithUserId[0] ? resultsWithUserId[0].toObject() : null
      const results = await ProjectDeviceCollect
        .find({ type, project, device, engineer })
        .sort({ updateTime: -1 })
        .exec()
      let resultsWithProjectData = null
      let projectDeviceSummaryByType = null
      if (results.length > 0) {
        const projectBaseMessage = {
          templateId: results[0].templateId,
          userId: results[0].userId,
          type: results[0].type,
          project: results[0].project,
          device: results[0].device,
          engineer: results[0].engineer,
        }
        const projectData = results[0].projectData
        let tableName = ''
        Object.keys(projectData).forEach((key) => {
          if (key.startsWith('table')) {
            tableName = key
          }
        })
        const tableData = []
        results.forEach((item) => {
          tableData.push(...item.projectData[tableName])
        })
        projectData[tableName] = tableData
        resultsWithProjectData = {
          ...projectBaseMessage,
          projectData,
        }
        const sumConfig = summaryConfig[type]
        if (sumConfig) {
          const classColumns = sumConfig.classColumns
          const summaryColumns = sumConfig.summaryColumns
          const summaryData = getSummaryData(tableData, classColumns, summaryColumns)
          const summaryProjectData = cloneDeep(projectData)
          summaryProjectData[tableName] = summaryData
          projectDeviceSummaryByType = {
            ...projectBaseMessage,
            projectData: summaryProjectData,
          }
        }
      }
      return {
        projectDeviceWithUserId,
        projectDeviceSummary: resultsWithProjectData,
        projectDeviceSummaryByType,
      }
    }
    catch (error) {
      console.error('获取项目设备数据失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 新增项目设备数据
  async addProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, projectData: any) {
    try {
      const data = {
        userId,
        type,
        project,
        device,
        engineer,
        templateId,
        projectData,
        updateTime: new Date(),
        createTime: new Date(),
      }
      // 先查询是否存在相同的数据，存在则更新，不存在则新增
      const existingData = await ProjectDeviceCollect.findOne({ userId, templateId, type, project, device, engineer }).exec()
      if (existingData) {
        return await ProjectDeviceCollect.updateOne({ _id: existingData._id }, { $set: data }).exec()
      }
      else {
        return await ProjectDeviceCollect.create(data).then((res) => {
          return 'success'
        })
      }
    }
    catch (error) {
      console.error('新增项目设备数据失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 更新项目设备数据
  async updateProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, projectData: any) {
    try {
      return await ProjectDeviceCollect.updateOne(
        { userId, templateId, type, project, device, engineer },
        { $set: { projectData, updateTime: new Date() } },
      ).exec()
    }
    catch (error) {
      console.error('更新项目设备数据失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 删除项目设备数据
  async deleteProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string) {
    try {
      return await ProjectDeviceCollect.deleteOne({ userId, templateId, type, project, device, engineer }).exec()
    }
    catch (error) {
      console.error('删除项目设备数据失败:', error)
      throw error
    }
  }
}
