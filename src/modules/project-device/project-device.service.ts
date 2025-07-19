import { Injectable } from '@nestjs/common'
import ProjectDeviceCollect from '~/monogdb/models/project-device'
import { addDataRowHideFields } from '~/utils/date.util'
import { getSummaryData } from './summary-config'
// 引入用户模块
import { UserService } from '../user/user.service'
import { compressData, decompressData, getJsonSizeMB } from '~/utils/mongodb.util'

@Injectable()
export class ProjectDeviceService {
  constructor(
    private readonly userService: UserService,
  ) { }

  // 根据 type, project, device, engineer 获取项目设备数据
  // 查出来的 projectData 是 { userName1: { projectData: any }, userName2: { projectData: any }... }
  // async getProjectDeviceData(query: any) {
  //   try {
  //     const { type, project, device, engineerId, engineer } = query
  //     console.log('query:', query)
  //     const result = await ProjectDeviceCollect
  //       .find({ type, project, device, engineerId, engineer })
  //       .sort({ updateTime: -1 })
  //       .limit(1)
  //       .exec()
  //     const projectDevice = result[0] ? result[0].toObject() : null
  //     if (!projectDevice || !projectDevice.projectData) {
  //       return null
  //     }
  //     const projectData = projectDevice.projectData
  //     // 汇总数据，就是把所有用户的数据做汇总
  //     const projectDeviceSummary = getSummaryData(projectData)
  //     const projectDeviceSummaryByType = getSummaryDataByType(projectDeviceSummary, summaryConfig[type].classColumns, summaryConfig[type].summaryColumns)

  //     return {
  //       projectDevice,
  //       projectDeviceSummary,
  //       projectDeviceSummaryByType,
  //     }
  //   }
  //   catch (error) {
  //     console.error('获取项目设备数据失败:', error)
  //     throw error
  //   }
  // }

  async getProjectDeviceData(query: any) {
    try {
      const { type, project, device, engineerId, engineer } = query
      console.log('query:', query)
      const result = await ProjectDeviceCollect
        .find({ type, project, device, engineerId, engineer })
        .sort({ updateTime: -1 })
        .limit(1)
        .exec()
      const projectDevice = result[0]
        ? (result.map((item) => {
          return {
            ...item.toObject(),
            _id: item._id.toString(),
          }
        }))[0]
        : null
      if (!projectDevice || !projectDevice.projectData) {
        return null
      }
      const projectData = projectDevice.projectData

      // 解压缩被压缩的用户数据
      for (const userName in projectData) {
        // 检查是否是压缩的数据
        // MongoDB Binary 类型格式：{ sub_type: 0, buffer: Uint8Array, position: number }
        if (projectData[userName] &&
          typeof projectData[userName] === 'object' &&
          projectData[userName].buffer &&
          (projectData[userName].buffer instanceof Buffer ||
            projectData[userName].buffer instanceof Uint8Array ||
            (projectData[userName].buffer && typeof projectData[userName].buffer === 'object'))) {
          try {
            projectData[userName] = await decompressData(projectData[userName])
          } catch (error) {
            console.error(`解压缩用户 ${userName} 的数据失败:`, error)
          }
        }
      }

      // 汇总数据，就是把所有用户的数据做汇总
      const projectDeviceSummary = getSummaryData(projectData)
      return {
        projectDevice,
        projectDeviceSummary,
      }
    }
    catch (error) {
      console.error('获取项目设备数据失败:', error)
      throw error
    }
  }

  // 根据 type, project, device, engineer 新增项目设备数据
  // projectData 是用户数据, 格式为 { userName: { projectData: any } }
  async addProjectDeviceData(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any, sjs: any) {
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
        sjs,
        updateTime: new Date(),
        createTime: new Date(),
      }
      const userName = Object.keys(projectData)[0]
      projectData[userName] = addDataRowHideFields(projectData[userName], userName)

      // 检查整个用户数据的大小，如果超过10MB则压缩
      const jsonSize = getJsonSizeMB(projectData[userName])
      if (jsonSize > 10) {
        // 压缩整个用户数据，并添加压缩标记
        projectData[userName] = await compressData(projectData[userName])
        // projectData[`${userName}_compressed`] = true
      }
      // 先查询当前工程是否存在数据，存在则更新，不存在则新增
      const existingData = await ProjectDeviceCollect.findOne({ templateId, type, project, device, engineer, engineerId }).exec()
      if (existingData) {
        // 更新用户数据
        existingData.projectData[userName] = projectData[userName]
        existingData.sjs = sjs
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
  async updateProjectDeviceData(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, projectData: any, sjs: any) {
    try {
      const userName = Object.keys(projectData)[0]
      const dataSet = addDataRowHideFields(projectData[userName], userName)
      projectData[userName] = dataSet
      return await ProjectDeviceCollect.updateOne(
        { templateId, type, project, device, engineer, engineerId },
        { $set: { projectData, sjs, updateTime: new Date() } },
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

  // 根据userId, type, project, device, engineer 删除项目设备数据样式文件
  async clearProjectDeviceStyles(templateId: string, type: string, project: string, device: string, engineer: string, engineerId: string, userName: string) {
    try {
      const projectData = await ProjectDeviceCollect.findOne({ templateId, type, project, device, engineer, engineerId }).exec()
      if (!projectData || !projectData.projectData[userName]) {
        return null
      }
      // 如果是压缩的数据，则解压缩
      if (projectData.projectData[userName] &&
        typeof projectData.projectData[userName] === 'object' &&
        projectData.projectData[userName].buffer &&
        (projectData.projectData[userName].buffer instanceof Buffer ||
          projectData.projectData[userName].buffer instanceof Uint8Array ||
          (projectData.projectData[userName].buffer && typeof projectData.projectData[userName].buffer === 'object'))) {
        try {
          projectData.projectData[userName] = await decompressData(projectData.projectData[userName])
          delete projectData.projectData[userName]._sjs
          // 重新压缩
          projectData.projectData[userName] = await compressData(projectData.projectData[userName])
        } catch (error) {
          console.error(`解压缩用户 ${userName} 的数据失败:`, error)
        }
      } else {
        projectData.projectData[userName]._sjs = null
      }
      return await ProjectDeviceCollect.updateOne({ templateId, type, project, device, engineer, engineerId }, { $set: { projectData: projectData.projectData } }).exec()
    }
    catch (error) {
      console.error('删除项目设备数据样式文件失败:', error)
      throw error
    }
  }

  // 删除所有项目设备数据样式文件（admin）
  async clearAllProjectDeviceStyles() {
    try {
      const projectDataList = await ProjectDeviceCollect.find({}).exec()
      if (!projectDataList || projectDataList.length === 0) {
        return null
      }

      // 逐个处理每个文档，避免一次性设置大文档
      for (const item of projectDataList) {
        const projectData = item.projectData
        if (projectData) {
          // 遍历所有用户，删除每个用户的 _sjs 属性
          for (const userName in projectData) {
            if (projectData[userName] && projectData[userName]._sjs) {
              // 使用点表示法逐个更新每个用户的 _sjs 属性
              await ProjectDeviceCollect.updateOne(
                { _id: item._id },
                { $unset: { [`projectData.${userName}._sjs`]: 1 } }
              ).exec()
            }
          }
        }
      }

      return { success: true, processedCount: projectDataList.length }
    }
    catch (error) {
      console.error('删除项目设备数据样式文件失败:', error)
      throw error
    }
  }
}
