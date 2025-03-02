import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission } from '../auth/decorators/permission.decorator'
import { QuickNavService } from './quick-nav.service'

export const permissions = definePermission('system:quick-nav', {
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

@ApiTags('快捷导航管理')
@ApiSecurityAuth()
@Controller('quick-nav')
export class QuickNavController {
  constructor(private QuickNavService: QuickNavService) {}

  // 获取快捷导航
  @Get('list')
  @ApiOperation({ summary: '获取快捷导航' })
  async getQuickNav() {
    return this.QuickNavService.getQuickNav()
  }

  // 新增快捷导航
  @Post('create')
  @ApiOperation({ summary: '新增快捷导航' })
  async addQuickNav(@Body() quickNav: any) {
    return this.QuickNavService.addQuickNav(quickNav)
  }

  // 更新快捷导航
  @Put('update')
  @ApiOperation({ summary: '更新快捷导航' })
  async updateQuickNav(@Body() quickNav: any) {
    return this.QuickNavService.updateQuickNav(quickNav)
  }
}
