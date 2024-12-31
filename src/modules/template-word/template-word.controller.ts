import { Controller, Delete, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { TemplateWordService } from './template-word.service'

@ApiTags('模板word管理')
@ApiSecurityAuth()
@Controller('template')
export class TemplateWordController {
  constructor(private templateWordService: TemplateWordService) {}

  // word相关
  @Get('/word/list')
  @ApiOperation({ summary: '获取模板word列表' })
  async list(@Query() dto: any): Promise<any[]> {
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
    return this.templateWordService.list(params)
  }

  @Post('/word/save')
  @ApiOperation({ summary: '保存word' })
  async save(@Req() req: any) {
    const data = await req.file()
    const name = (data.fields.name as any).value
    const code = (data.fields.code as any).value
    const isBuildIn = (data.fields.isBuildIn as any).value
    const status = (data.fields.status as any).value
    const note = (data.fields.note as any).value
    const file = await (data.fields.file as any).toBuffer()
    const fileName = data.fields.file.filename
    const parmas = {
      name,
      code,
      isBuildIn,
      note,
      status,
      file: file.toString('hex'),
      fileName,
    }
    const result = await this.templateWordService.create(parmas)
    return {
      id: result._id.toString(),
    }
  }

  @Delete('/word/delete')
  @ApiOperation({ summary: '删除word' })
  async deleteWord(@Query() query: { id: string }) {
    const { id = '' } = query
    return this.templateWordService.remove(id)
  }

  @Get('/word/download')
  @ApiOperation({ summary: '下载word' })
  async download(@Query() query: { id: string }) {
    const { id = '' } = query
    return this.templateWordService.word(id)
  }
}
