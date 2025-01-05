import { BadRequestException, Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { TemplateTypeQueryDto } from './template.dto'
import { TemplateService } from './template.service'

export const permissions = definePermission('system:template', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  SAVE: 'save',
} as const)

@ApiTags('模板管理')
@ApiSecurityAuth()
@Controller('template')
export class TemplateController {
  constructor(private TemplateService: TemplateService) {}

  // excel相关
  @Get('list')
  @ApiOperation({ summary: '获取模板列表' })
  @Perm(permissions.LIST)
  async list(@Query() dto: TemplateTypeQueryDto): Promise<any[]> {
    const { name, status, isBuildIn } = dto
    const params: any = {}
    if (name) {
      params.name = name
    }
    if (status !== undefined) {
      params.status = status
    }
    if (isBuildIn !== undefined) {
      params.isBuildIn = {
        1: true,
        0: false,
      }[isBuildIn]
    }
    return this.TemplateService.list(params)
  }

  @Get('/excel/ejs')
  @ApiOperation({ summary: '获取模板ejs' })
  async ejs(@Query() query: { id: string }) {
    const { id = '' } = query
    return this.TemplateService.excelEsj(id)
  }

  @Post('/excel/save')
  @ApiOperation({ summary: '新增excel模板' })
  @Perm(permissions.CREATE)
  async create(@Req() req: FastifyRequest, @Body() body: any) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const data = await req.file()
    const name = (data.fields.name as any).value
    const code = (data.fields.code as any).value
    const isBuildIn = (data.fields.isBuildIn as any).value
    const status = (data.fields.status as any).value
    const note = (data.fields.note as any).value
    const file = await (data.fields.file as any).toBuffer()
    const parmas = {
      name,
      code,
      isBuildIn,
      note,
      status,
      file: file.toString('hex'),
    }
    const result = await this.TemplateService.create(parmas).catch((err) => {
      return err.message
    })
    return {
      id: result._id.toString(),
    }
  }

  @Post('/excel/update')
  @ApiOperation({ summary: '更新excel模板' })
  @Perm(permissions.CREATE)
  async update(@Req() req: FastifyRequest, @Body() body: any) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const data = await req.file()
    const id = (data.fields.id as any).value
    const name = (data.fields.name as any).value
    const code = (data.fields.code as any).value
    const isBuildIn = (data.fields.isBuildIn as any).value
    const status = (data.fields.status as any).value
    const note = (data.fields.note as any).value
    const file = await (data.fields.file as any).toBuffer()
    const parmas = {
      name,
      code,
      isBuildIn,
      note,
      status,
      file: file.toString('hex'),
    }
    return this.TemplateService.update(id, parmas)
  }

  @Delete('/excel')
  @ApiOperation({ summary: '删除excel模板' })
  @Perm(permissions.DELETE)
  async remove(@Req() req: FastifyRequest, @Query() query) {
    const result = await this.TemplateService.remove(query.id)
    return {
      result,
    }
  }
}
