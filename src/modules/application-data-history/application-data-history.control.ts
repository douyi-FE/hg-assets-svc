import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { ApplicationDataHistoryService } from './application-data-history.service'

export const permissions = definePermission('system:application-history', {
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

@ApiTags('应用数据历史版本管理')
@ApiSecurityAuth()
@Controller('application/history')
export class ApplicationDataHistoryController {
  constructor(private ApplicationDataHistoryService: ApplicationDataHistoryService) {}

  // 依据applicationId获取应用数据历史版本
  @Get('list')
  @ApiOperation({ summary: '依据applicationId获取应用数据历史版本' })
  @Perm(permissions.READ)
  async getApplicationHistoryList(@Query() query: any) {
    return this.ApplicationDataHistoryService.getApplicationHistoryList(query)
  }

  // 添加历史版本数据
  @Post('data')
  @ApiOperation({ summary: '添加历史版本数据' })
  @Perm(permissions.CREATE)
  async addApplicationDataHistory(@Body() body: any) {
    return this.ApplicationDataHistoryService.addApplicationDataHistory(body)
  }

  // 删除历史版本数据
  @Delete('data')
  @ApiOperation({ summary: '删除历史版本数据' })
  @Perm(permissions.DELETE)
  async deleteApplicationDataHistory(@Body() body: any) {
    return this.ApplicationDataHistoryService.deleteApplicationDataHistory(body.id)
  }

  // 获取历史版本数据详情
  @Get('data/:id')
  @ApiOperation({ summary: '获取历史版本数据详情' })
  @Perm(permissions.READ)
  async getApplicationDataHistoryDetail(@Param('id') id: string) {
    return this.ApplicationDataHistoryService.getApplicationDataHistoryDetail(id)
  }

  // 依据id更新历史版本名称
  @Put('data/:id')
  @ApiOperation({ summary: '依据id更新历史版本名称' })
  @Perm(permissions.UPDATE)
  async updateApplicationDataHistoryName(@Param('id') id: string, @Body() body: any) {
    return this.ApplicationDataHistoryService.updateApplicationDataHistoryName(id, body.name)
  }
}
