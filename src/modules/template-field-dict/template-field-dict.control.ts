import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { TemplateFieldDictService } from './template-field-dict.service'

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

@ApiTags('模板字段字典管理')
@ApiSecurityAuth()
@Controller('template-field-dict')
export class TemplateFieldDictController {
  constructor(private TemplateFieldDictService: TemplateFieldDictService) {}

  @Get('data')
  @ApiOperation({ summary: '获取模板字段字典数据' })
  @Perm(permissions.READ)
  async getTemplateFieldDict(@Query() query: any) {
    return this.TemplateFieldDictService.getTemplateFieldDict(query)
  }

  @Post('data')
  @ApiOperation({ summary: '新增或更新模板字段字典数据' })
  @Perm(permissions.CREATE)
  async addOrUpdateTemplateFieldDict(@Body() body: any) {
    try {
      const { userId, templateId, applicationData, deptId } = body
      const result = await this.TemplateFieldDictService.addOrUpdateTemplateFieldDict(userId, templateId, applicationData, deptId)
      return {
        code: 200,
        message: '新增或更新模板字段字典数据成功',
        data: result,
      }
    }
    catch (error) {
      console.error('新增或更新模板字段字典数据失败:', error)
      return {
        code: 500,
        message: error.message || '新增或更新模板字段字典数据失败',
        data: null,
      }
    }
  }
}
