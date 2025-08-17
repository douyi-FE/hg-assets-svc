import { Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common'
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
  PUBLISH: 'publish',
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

  // 依据ids获取模板列表
  @Get('list/ids')
  @ApiOperation({ summary: '依据ids获取模板列表' })
  @Perm(permissions.LIST)
  async listByIds(@Query() query: { ids: string[] }) {
    return this.TemplateService.listByIds(query.ids)
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
  async create(@Body() body: any) {
    const { name, code, flowPath = '', isBuildIn, status, note, initDataSource, sjs } = body
    const parmas = {
      name,
      code,
      flowPath,
      isBuildIn,
      note,
      status,
      initDataSource,
      file: sjs,
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
  async update(@Body() body: any) {
    const { id, name, code, flowPath = '', isBuildIn, status, note, initDataSource, sjs } = body
    const parmas = {
      name,
      code,
      flowPath,
      isBuildIn,
      note,
      // status,
      // 修改后需要手动发布
      status: 0,
      initDataSource,
      file: sjs,
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

  // 发布模板
  @Post('/excel/publish')
  @ApiOperation({ summary: '发布模板' })
  @Perm(permissions.PUBLISH)
  async publish(@Req() req: FastifyRequest, @Query() query: any) {
    return this.TemplateService.publish(query.id)
  }
}
