import { Injectable } from '@nestjs/common'
import { cloneDeep } from 'lodash'
import ProjectDeviceCollect from '~/monogdb/models/project-device'
import { addDataRowHideFields } from '~/utils/date.util'
import { getSummaryData, summaryConfig } from './summary-config'
// 引入用户模块
import { UserService } from '../user/user.service'

@Injectable()
export class ProjectDeviceService {
  constructor(
    private readonly userService: UserService,
  ) { }

  // 根据userId, type, project, device, engineer 获取项目设备数据
  // 先查出userId 对应的数据，再查出所有数据，分成两个属性保存并返回
  async getProjectDeviceData(query: any) {
    try {
      const { userId, type, project, device, engineerId, engineer } = query
      console.log('query:', query)
      const resultsWithUserId = await ProjectDeviceCollect
        .find({ userId, type, project, device, engineerId, engineer })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const projectDeviceWithUserId = resultsWithUserId[0] ? resultsWithUserId[0].toObject() : null
      const results = await ProjectDeviceCollect
        .find({ type, project, device, engineer, engineerId })
        .sort({ updateTime: -1 })
        .exec()
      let resultsWithProjectData = null
      let projectDeviceSummaryByType = null
      if (results.length > 0) {
        // 获取用户列表
        const userInfo = await this.userService.list({
          page: 1,
          pageSize: 10000,
        })
        const userInfoArr = []
        if (userInfo && userInfo.items) {
          userInfo.items.forEach((user) => {
            userInfoArr.push(user)
          })
        }
        const projectBaseMessage = {
          templateId: results[0].templateId,
          userId: results[0].userId,
          type: results[0].type,
          project: results[0].project,
          device: results[0].device,
          engineer: results[0].engineer,
        }
        const projectData = results[0].projectData
        const sheets = Object.keys(projectData)
        if (sheets.length > 0) {
          let tableName = ''
          Object.keys(projectData[sheets[0]]).forEach((key) => {
            if (key.startsWith('table')) {
              tableName = key
            }
          })
          const tableData = []
          results.forEach((item) => {
            const itemUserId = Number.parseInt(item.userId)
            const itemUserName = userInfoArr.find(user => user.id === itemUserId)?.username
            if (item.projectData[sheets[0]][tableName]) {
              item.projectData[sheets[0]][tableName].forEach((d) => {
                d.userId = itemUserId
                d['创建人'] = itemUserName
              })
              tableData.push(...item.projectData[sheets[0]][tableName])
            }
          })
          projectData[sheets[0]][tableName] = tableData
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
            summaryProjectData[sheets[0]][tableName] = summaryData
            projectDeviceSummaryByType = {
              ...projectBaseMessage,
              projectData: summaryProjectData,
            }
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
  async addProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any) {
    try {
      projectData = addDataRowHideFields(projectData)
      const data = {
        userId,
        type,
        project,
        device,
        engineer,
        engineerId,
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

  // 根据 遍历所有汇总表数据，提取所有 _comments 不为空的数据，根据 templateId 和 数据的 userId 查询出对应的数据，再根据数据行的 _id 更新 _comments 数据
  async updateProjectDeviceDataComments(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any) {
    try {
      // 1. 先遍历汇总表中所有数据，提取所有 _comments 不为空的数据
      const summaryData = projectData.summary
      if (summaryData) {
        Object.keys(summaryData).forEach((key) => {
          const sheetData = summaryData[key]
          if (sheetData) {
            const tableName = Object.keys(sheetData).find(item => item.startsWith('table'))
            if (tableName) {
              const tableData = sheetData[tableName]
              if (tableData) {
                tableData.forEach(async (item) => {
                  if (item._comments && item._comments.length > 0) {
                    // 2. 根据 templateId 和 数据的 userId 查询出对应的数据
                    const data = await ProjectDeviceCollect.findOne({ userId, templateId, type, project, device, engineer, engineerId }).exec()
                    let isUpdate = false
                    if (data) {
                      data.projectData[key][tableName].forEach((d) => {
                        if (d._id === item._id) {
                          d._comments = item._comments
                          isUpdate = true
                        }
                      })
                    }
                    if (isUpdate) {
                      await ProjectDeviceCollect.updateOne({ userId, templateId, type, project, device, engineer, engineerId }, { $set: { projectData: data.projectData } }).exec()
                    }
                  }
                })
              }
            }
          }
        })
      }
    }
    catch (error) {
      console.error('更新数据批注失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 更新项目设备数据
  async updateProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any) {
    try {
      projectData = addDataRowHideFields(projectData)
      return await ProjectDeviceCollect.updateOne(
        { userId, templateId, type, project, device, engineer, engineerId },
        { $set: { projectData, updateTime: new Date() } },
      ).exec()
    }
    catch (error) {
      console.error('更新项目设备数据失败:', error)
      throw error
    }
  }

  // 根据userId, type, project, device, engineer 删除项目设备数据
  async deleteProjectDeviceData(userId: string, templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string) {
    try {
      return await ProjectDeviceCollect.deleteOne({ userId, templateId, type, project, device, engineer, engineerId }).exec()
    }
    catch (error) {
      console.error('删除项目设备数据失败:', error)
      throw error
    }
  }
}
