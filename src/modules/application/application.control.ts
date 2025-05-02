import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { ApplicationService } from './application.service'

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
export class ApplicationController {
  constructor(private ApplicationService: ApplicationService) {}

  // 获取应用列表
  @Get('list')
  @ApiOperation({ summary: '获取应用列表' })
  @Perm(permissions.LIST)
  async getApplication(@Query() query: any) {
    return this.ApplicationService.getApplication(query)
  }

  @Get('/:id')
  @ApiOperation({ summary: '获取应用详情' })
  @Perm(permissions.READ)
  async getApplicationById(@Param('id') id: string) {
    return this.ApplicationService.getApplicationById(id)
  }

  @Get('/name/:name')
  @ApiOperation({ summary: '获取应用详情' })
  @Perm(permissions.READ)
  async getApplicationByName(@Param('name') name: string) {
    return this.ApplicationService.getApplicationByName(name)
  }

  // 新增应用
  @Post('create')
  @ApiOperation({ summary: '新增应用' })
  @Perm(permissions.CREATE)
  async addApplication(@Body() application: any) {
    return this.ApplicationService.addApplication(application)
  }

  // 依据id更新应用
  @Put('/:id')
  @ApiOperation({ summary: '依据id更新应用' })
  @Perm(permissions.UPDATE)
  async updateApplicationById(@Param('id') id: string, @Body() application: any) {
    return this.ApplicationService.updateApplicationById(id, application)
  }

  // 更新应用
  @Put('update')
  @ApiOperation({ summary: '更新应用' })
  @Perm(permissions.UPDATE)
  async updateApplication(@Body() application: any) {
    return this.ApplicationService.updateApplication(application)
  }

  // 发布应用
  @Post('publish')
  @ApiOperation({ summary: '发布应用' })
  @Perm(permissions.APPLY)
  async publishApplication(@Body() application: any) {
    return this.ApplicationService.publishApplication(application)
  }
}
