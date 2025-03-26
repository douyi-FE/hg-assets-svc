import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { TemplateDataService } from './templateData.service'

@ApiTags('内置ejs')
@ApiSecurityAuth()
@Controller('template')
export class TemplateDataController {
  constructor(private templateDataService: TemplateDataService) {}

  @Get('/data/list')
  @ApiOperation({ summary: '获取模板-应用列表数据' })
  async list(@Query() dto) {
    return this.templateDataService.find()
  }

  @Post('/data/create')
  @ApiOperation({ summary: '创建模板-应用列表数据' })
  async create(@Req() req: FastifyRequest, @Body() body: any) {
    const { applicationName, templateId, templateName } = body
    return this.templateDataService.create(applicationName, templateId, templateName).then((res) => {
      return 'success'
    }).catch((err) => {
      return err
    })
  }

  @Post('/data/update')
  @ApiOperation({ summary: '更新模板-应用列表数据' })
  async update(@Req() req: FastifyRequest, @Body() body: any) {
    const { id, applicationName, templateId, templateName } = body
    return this.templateDataService.update(id, applicationName, templateId, templateName).then((res) => {
      return 'success'
    }).catch((err) => {
      return err
    })
  }

  @Post('/data/delete')
  @ApiOperation({ summary: '删除模板-应用列表数据' })
  async delete(@Req() req: FastifyRequest, @Body() body: any) {
    const { id } = body
    return this.templateDataService.delete(id).then((res) => {
      return 'success'
    }).catch((err) => {
      return err
    })
  }

  @Get('/data/application')
  @ApiOperation({ summary: '依据应用名查找模板-应用数据' })
  async application(@Query() dto) {
    const { applicationName } = dto
    return this.templateDataService.findByApplicationName(applicationName)
  }
}
