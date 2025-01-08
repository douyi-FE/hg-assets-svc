import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import axios from 'axios'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

@ApiTags('报告')
@ApiSecurityAuth()
@Controller('outputvalue')
export class OutputValueController {
  // 版本列表
  @Post('report')
  @ApiOperation({ summary: '生成报告' })
  async create(@Body() body: any): Promise<any> {
    try {
      const JAVA_HOST = process.env.JAVA_HOST
      if (!JAVA_HOST) {
        throw new HttpException('JAVA_HOST 未配置', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      const { templateBase64, data, qrCodes } = body

      const response = await axios({
        method: 'post',
        url: `${JAVA_HOST}/api/word-report/generate`,
        data: {
          data,
          templateBase64,
          qrCodes,
        },
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/zip',
        },
      }).catch((error) => {
        // 处理 axios 错误
        if (error.response) {
          throw new HttpException(
            error.response.data || '生成报告失败',
            error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }
        throw new HttpException('生成报告失败', HttpStatus.INTERNAL_SERVER_ERROR)
      })

      // 检查是否收到数据
      if (!response.data) {
        throw new HttpException('未收到报告数据', HttpStatus.BAD_REQUEST)
      }

      const zipFileName = response.headers['content-disposition']
        ?.split('filename=')[1]
        ?.replace(/"/g, '') || 'report.zip'

      return {
        data: response.data,
        fileName: zipFileName,
        type: 'application/zip',
      }
    }
    catch (error) {
      // 统一错误处理
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        error.message || '生成报告失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
