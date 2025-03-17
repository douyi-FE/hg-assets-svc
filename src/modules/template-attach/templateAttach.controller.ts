import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { TemplateAttachService } from './templateAttach.service'

@ApiTags('表格附件')
@ApiSecurityAuth()
@Controller('template')
export class TemplateAttachController {
  constructor(private templateAttachService: TemplateAttachService) {}

  @Post('/attach/upload')
  @ApiOperation({ summary: '上传附件' })
  async upload(@Body() body: any): Promise<any> {
    const { files = [] } = body
    const result = []
    for (const file of files) {
      const res = await this.templateAttachService.upload(file)
      result.push(res)
    }
  }

  @Get('/attach/download')
  @ApiOperation({ summary: '下载附件' })
  async download(@Query() query: any) {
    const { fileId = '' } = query
    return this.templateAttachService.download(fileId)
  }

  @Get('/attach/downloadZip')
  @ApiOperation({ summary: '下载附件包' })
  async downloadZip(@Query() query: any) {
    const { fileIds = [] } = query
    return this.templateAttachService.downloadZip(fileIds)
  }

  @Post('/attach/delete')
  @ApiOperation({ summary: '删除附件' })
  async delete(@Query() query: any) {
    const { fileId = '' } = query
    await this.templateAttachService.delete(fileId)
  }

  @Get('/attach/findByFileId')
  @ApiOperation({ summary: '根据fileId查询附件' })
  async findByFileId(@Query() query: any) {
    const { fileId = '' } = query
    return await this.templateAttachService.findByFileId(fileId)
  }

  @Get('/attach/findByFileIds')
  @ApiOperation({ summary: '根据fileIds查询附件' })
  async findByFileIds(@Query() query: any) {
    const { fileIds = [] } = query
    return this.templateAttachService.findByFileIds(fileIds)
  }
}
