import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { ProjectDeviceService } from './project-device.service'

export const permissions = definePermission('system:project-device', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  SAVE: 'save',
  APPLY: 'apply',
} as const)

@ApiTags('项目设备管理')
@ApiSecurityAuth()
@Controller('project-device')
export class ProjectDeviceController {
  constructor(private ProjectDeviceService: ProjectDeviceService) {}

  // 依据UserId, type, project, device, engineer 获取项目设备数据
  // 如果 userId 为空，则获取所有数据
  @Get('data')
  @ApiOperation({ summary: '依据UserId, type, project, device, engineerId, engineer 获取项目设备数据' })
  @Perm(permissions.READ)
  async getProjectDeviceData(@Query() query: any) {
    return this.ProjectDeviceService.getProjectDeviceData(query)
  }

  // 依据UserId, type, project, device, engineer 新增项目设备数据
  @Post('data')
  @ApiOperation({ summary: '依据UserId, type, project, device, engineer 新增项目设备数据' })
  @Perm(permissions.CREATE)
  async addProjectDeviceData(@Body() body: any) {
    try {
      const { userId, templateId, type, project, device, engineer, engineerId, projectData } = body
      const result = await this.ProjectDeviceService.addProjectDeviceData(userId, templateId, type, project, device, engineer, engineerId, projectData)
      await this.ProjectDeviceService.updateProjectDeviceDataComments(userId, templateId, type, project, device, engineer, engineerId, projectData)
      return {
        code: 200,
        message: '新增项目设备数据成功',
        data: result,
      }
    }
    catch (error) {
      console.error('新增项目设备数据失败:', error)
      return {
        code: 500,
        message: error.message || '新增项目设备数据失败',
        data: null,
      }
    }
  }

  // 依据UserId, type, project, device, engineer 更新项目设备数据
  @Put('data')
  @ApiOperation({ summary: '依据UserId, templateId, project, device, engineer, engineerId 更新项目设备数据' })
  @Perm(permissions.UPDATE)
  async updateProjectDeviceData(@Body() body: any) {
    const { userId, templateId, type, project, device, engineer, engineerId, projectData } = body
    return this.ProjectDeviceService.updateProjectDeviceData(userId, templateId, type, project, device, engineer, engineerId, projectData)
  }

  // 依据UserId, type, project, device, engineer 删除项目设备数据
  @Delete('data')
  @ApiOperation({ summary: '依据UserId, type, project, device, engineer 删除项目设备数据' })
  @Perm(permissions.DELETE)
  async deleteProjectDeviceData(@Body() body: any) {
    const { userId, templateId, type, project, device, engineer, engineerId } = body
    return this.ProjectDeviceService.deleteProjectDeviceData(userId, templateId, type, project, device, engineer, engineerId)
  }
}
