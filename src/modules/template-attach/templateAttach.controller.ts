import { Body, Controller, Get, Post, Query, Req, BadRequestException } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiConsumes } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { TemplateAttachService } from './templateAttach.service'

@ApiTags('表格附件')
@ApiSecurityAuth()
@Controller('template')
export class TemplateAttachController {
  constructor(private templateAttachService: TemplateAttachService) {}

  @Post('/attach/upload')
  @ApiOperation({ summary: '上传附件' })
  @ApiConsumes('multipart/form-data', 'application/json')
  async upload(@Req() req: FastifyRequest, @Body() body?: any): Promise<any> {
    // 检查是否为multipart请求
    if (req.isMultipart()) {
      try {
        const data = await req.file()
        const file = data.fields.file as any
        if (!file) {
          throw new BadRequestException('没有找到文件')
        }
        
        const fileBuffer = await file.toBuffer()
        const fileData = {
          fileId: (data.fields.fileId as any)?.value || '',
          originalFileName: file.filename,
          fileName: file.filename,
          fileContent: fileBuffer.toString('base64'),
          fileExtension: file.filename.split('.').pop() || '',
          fileTime: Date.now(),
          fileSize: fileBuffer.length,
        }
        
        const result = await this.templateAttachService.upload(fileData)
        return result
      } catch (error) {
        console.error('文件上传错误:', error)
        throw new BadRequestException('文件上传失败')
      }
    } else {
      // 处理JSON格式的请求（向后兼容）
      const { files = [] } = body || {}
      const result = []
      for (const file of files) {
        const res = await this.templateAttachService.upload(file)
        result.push(res)
      }
      return 'success'
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
