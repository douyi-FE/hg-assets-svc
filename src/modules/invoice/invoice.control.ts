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
    const { code, uid, invoiceData, status } = body
    const result = await this.InvoiceService.addInvoiceData(code, uid, invoiceData, status)
    return {
      code: 200,
      message: '新增开票数据成功',
      data: result,
    }
  }

  // 依据项目编码删除开票数据
  @Delete('data')
  @ApiOperation({ summary: '依据项目编码删除开票数据' })
  @Perm(permissions.DELETE)
  async deleteApplicationData(@Body() body: any) {
    const { code } = body
    return this.InvoiceService.deleteInvoiceData(code)
  }

  // 提交发票申请，执行发票流程
  @Post('apply')
  @ApiOperation({ summary: '提交发票申请，执行发票流程' })
  @Perm(permissions.APPLY)
  async applyInvoice(@Body() body: any) {
    const { code, flowId } = body
    return this.InvoiceService.applyInvoice(code, flowId)
  }
}
