import { Injectable } from '@nestjs/common'
import ProjectDeviceCollect from '~/monogdb/models/project-device'
import { addDataRowHideFields } from '~/utils/date.util'
import { getSummaryData, getSummaryDataByType, summaryConfig } from './summary-config'
// 引入用户模块
import { UserService } from '../user/user.service'

@Injectable()
export class ProjectDeviceService {
  constructor(
    private readonly userService: UserService,
  ) { }

  // 根据 type, project, device, engineer 获取项目设备数据
  // 查出来的 projectData 是 { userName1: { projectData: any }, userName2: { projectData: any }... }
  async getProjectDeviceData(query: any) {
    try {
      const { type, project, device, engineerId, engineer } = query
      console.log('query:', query)
      const result = await ProjectDeviceCollect
        .find({ type, project, device, engineerId, engineer })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const projectDevice = result[0] ? result[0].toObject() : null
      if (!projectDevice || !projectDevice.projectData) {
        return null
      }
      const projectData = projectDevice.projectData
      // 汇总数据，就是把所有用户的数据做汇总
      const projectDeviceSummary = getSummaryData(projectData)
      const projectDeviceSummaryByType = getSummaryDataByType(projectDeviceSummary, summaryConfig[type].classColumns, summaryConfig[type].summaryColumns)

      return {
        projectDevice,
        projectDeviceSummary,
        projectDeviceSummaryByType,
      }
    }
    catch (error) {
      console.error('获取项目设备数据失败:', error)
      throw error
    }
  }

  // 根据 type, project, device, engineer 新增项目设备数据
  // projectData 是用户数据, 格式为 { userName: { projectData: any } }
  async addProjectDeviceData(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any, summarySheetComments: any) {
    try {
      // projectData = addDataRowHideFields(projectData)
      const data = {
        type,
        project,
        device,
        engineer,
        engineerId,
        templateId,
        projectData,
        summarySheetComments,
        updateTime: new Date(),
        createTime: new Date(),
      }
      const userName = Object.keys(projectData)[0]
      projectData[userName] = addDataRowHideFields(projectData[userName], userName)
      // 先查询当前工程是否存在数据，存在则更新，不存在则新增
      const existingData = await ProjectDeviceCollect.findOne({ templateId, type, project, device, engineer, engineerId }).exec()
      if (existingData) {
        // 更新用户数据
        existingData.projectData[userName] = projectData[userName]
        existingData.summarySheetComments = summarySheetComments
        return await ProjectDeviceCollect.updateOne({ _id: existingData._id }, { $set: existingData }).exec()
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
  async updateProjectDeviceData(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any, summarySheetComments: any) {
    try {
      const userName = Object.keys(projectData)[0]
      const dataSet = addDataRowHideFields(projectData[userName], userName)
      projectData[userName] = dataSet
      return await ProjectDeviceCollect.updateOne(
        { templateId, type, project, device, engineer, engineerId },
        { $set: { projectData, summarySheetComments, updateTime: new Date() } },
      ).exec()
    }
    catch (error) {
      console.error('更新项目设备数据失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 删除项目设备数据
  async deleteProjectDeviceData(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string) {
    try {
      return await ProjectDeviceCollect.deleteOne({ templateId, type, project, device, engineer, engineerId }).exec()
    }
    catch (error) {
      console.error('删除项目设备数据失败:', error)
      throw error
    }
  }
}
