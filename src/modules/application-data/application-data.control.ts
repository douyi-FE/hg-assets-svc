import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { ApplicationDataService } from './application-data.service'

export const permissions = definePermission('system:application', {
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

@ApiTags('应用管理')
@ApiSecurityAuth()
@Controller('application')
export class ApplicationDataController {
  constructor(private ApplicationDataService: ApplicationDataService) {}

  // 依据userId与templateId获取应用数据
  @Get('data')
  @ApiOperation({ summary: '依据userId与templateId获取应用数据' })
  @Perm(permissions.READ)
  async getApplicationDataByUserId(@Query() query: any) {
    return this.ApplicationDataService.getApplicationDataByUserId(query)
  }

  // 依据userId与templateId新增应用数据
  @Post('data')
  @ApiOperation({ summary: '依据userId与templateId新增应用数据' })
  @Perm(permissions.CREATE)
  async addApplicationData(@Body() body: any) {
    try {
      const { userId, templateId, applicationData, deptId } = body
      const result = await this.ApplicationDataService.addApplicationData(userId, templateId, applicationData, deptId)
      return {
        code: 200,
        message: '新增应用数据成功',
        data: result,
      }
    }
    catch (error) {
      console.error('新增应用数据失败:', error)
      return {
        code: 500,
        message: error.message || '新增应用数据失败',
        data: null,
      }
    }
  }

  // 依据userId与templateId更新应用数据
  @Put('data')
  @ApiOperation({ summary: '依据userId与templateId更新应用数据' })
  @Perm(permissions.UPDATE)
  async updateApplicationData(@Body() body: any) {
    const { userId, templateId, applicationData } = body
    return this.ApplicationDataService.updateApplicationData(userId, templateId, applicationData)
  }

  // 依据userId与templateId删除应用数据
  @Delete('data')
  @ApiOperation({ summary: '依据userId与templateId删除应用数据' })
  @Perm(permissions.DELETE)
  async deleteApplicationData(@Body() body: any) {
    const { userId, templateId } = body
    return this.ApplicationDataService.deleteApplicationData(userId, templateId)
  }
}
