import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { TemplateVersionService } from './template-version.service'

export const permissions = definePermission('system:template', {
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

@ApiTags('模板版本管理')
@ApiSecurityAuth()
@Controller('template/version')
export class TemplateVersionController {
  constructor(private TemplateVersionService: TemplateVersionService) {}

  // 版本列表
  @Get('list')
  @ApiOperation({ summary: '获取版本列表' })
  @Perm(permissions.LIST)
  async list(@Query() dto: any): Promise<any[]> {
    return this.TemplateVersionService.list(dto)
  }

  // 获取模板版本内容
  @Get('content')
  @ApiOperation({ summary: '获取模板版本' })
  async getTemplateVersion(@Query() dto: any): Promise<any> {
    return this.TemplateVersionService.getTemplateVersion(dto.id)
  }

  // 版本保存
  @Post('save')
  @ApiOperation({ summary: '版本保存' })
  @Perm(permissions.SAVE)
  async save(@Req() req: FastifyRequest): Promise<any> {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')
    const data = await req.file()
    const templateId = (data.fields.templateId as any).value
    const note = (data.fields.note as any).value
    const type = (data.fields.type as any).value
    const file = await (data.fields.file as any).toBuffer()
    const result = await this.TemplateVersionService.save({
      templateId,
      note,
      type,
      file: file.toString('hex'),
    }).then(() => {
      return {
        message: '保存成功',
      }
    })
    return result
  }

  // 版本更新
  @Put('update')
  @ApiOperation({ summary: '版本更新' })
  @Perm(permissions.UPDATE)
  async update(@Query() dto: any): Promise<any> {
    return this.TemplateVersionService.update(dto)
  }

  // 版本删除
  @Delete('delete')
  @ApiOperation({ summary: '版本删除' })
  @Perm(permissions.DELETE)
  async delete(@Query() dto: any): Promise<any> {
    const { id = '' } = dto
    return this.TemplateVersionService.delete(id)
  }

  // 版本应用
  @Post('apply')
  @ApiOperation({ summary: '版本应用' })
  @Perm(permissions.APPLY)
  async apply(@Body() dto: any): Promise<any> {
    return this.TemplateVersionService.apply(dto)
  }
}
