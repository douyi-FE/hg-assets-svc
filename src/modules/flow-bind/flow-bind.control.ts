import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { FlowBindService } from './flow-bind.service'

export const permissions = definePermission('financial:invoice', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
})
@ApiTags('流程绑定管理')
@ApiSecurityAuth()
@Controller('flow/bind')
export class FlowBindController {
  constructor(private readonly flowBindService: FlowBindService) {}

  // 获取所有流程绑定数据
  @Get('list')
  @ApiOperation({ summary: '获取所有流程绑定数据' })
  @Perm(permissions.READ)
  async getFlowBindData(@Query() query: any) {
    return this.flowBindService.getFlowBindData(query)
  }

  // 新增流程绑定
  @Post('data')
  @ApiOperation({ summary: '新增流程绑定' })
  @Perm(permissions.CREATE)
  async addFlowBindData(@Body() flowBindData: any) {
    return this.flowBindService.addFlowBindData(flowBindData)
  }

  // 删除流程绑定
  @Delete('data')
  @ApiOperation({ summary: '删除流程绑定' })
  @Perm(permissions.DELETE)
  async deleteFlowBindData(@Body() flowBindData: any) {
    const { id } = flowBindData
    return this.flowBindService.deleteFlowBindData(id)
  }
}
