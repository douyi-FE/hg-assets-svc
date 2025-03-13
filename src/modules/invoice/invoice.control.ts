import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { InvoiceService } from './invoice.service'

export const permissions = definePermission('financial:invoice', {
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

@ApiTags('开票管理')
@ApiSecurityAuth()
@Controller('invoice')
export class InvoiceController {
  constructor(private InvoiceService: InvoiceService) {}

  // 获取所有开票数据
  @Get('list')
  @ApiOperation({ summary: '获取所有开票数据' })
  @Perm(permissions.READ)
  async getInvoiceData() {
    return this.InvoiceService.getInvoiceData()
  }

  // 依据项目编码获取开票数据
  @Get('data')
  @ApiOperation({ summary: '依据项目编码获取开票数据' })
  @Perm(permissions.READ)
  async getInvoiceDataByProjectCode(@Query() query: any) {
    return this.InvoiceService.getInvoiceDataByProjectCode(query)
  }

  // 新增开票数据
  @Post('data')
  @ApiOperation({ summary: '新增开票数据' })
  @Perm(permissions.CREATE)
  async addApplicationData(@Body() body: any) {
    try {
      const { invoiceData } = body
      const result = await this.InvoiceService.addInvoiceData(invoiceData)
      return {
        code: 200,
        message: '新增开票数据成功',
        data: result,
      }
    }
    catch (error) {
      console.error('新增应用数据失败:', error)
      return {
        code: 500,
        message: error.message || '新增应用数据失败',
        data: null,
      }
    }
  }

  // 依据项目编码删除开票数据
  @Delete('data')
  @ApiOperation({ summary: '依据项目编码删除开票数据' })
  @Perm(permissions.DELETE)
  async deleteApplicationData(@Body() body: any) {
    const { projectCode } = body
    return this.InvoiceService.deleteInvoiceData(projectCode)
  }
}
