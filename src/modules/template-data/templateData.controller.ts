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
  @ApiOperation({ summary: '获取模板列表数据' })
  async list(@Query() dto) {
    const { code = '' } = dto
    return this.templateDataService.find(code)
  }

  @Post('/data/save')
  @ApiOperation({ summary: '保存模板列表数据' })
  async save(@Req() req: FastifyRequest, @Body() body: any) {
    const { name, code, record } = body
    return this.templateDataService.save(code, name, record)
  }
}
