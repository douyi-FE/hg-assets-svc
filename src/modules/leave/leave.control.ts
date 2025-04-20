import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { uniqueId } from 'lodash'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { bootstrap } from '~/work-flow'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { FlowDesignService } from '../flow-design/flowDesign.service'
import { LeaveService } from './leave.service'

export const permissions = definePermission('financial:invoice', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
})
@ApiTags('请假管理')
@ApiSecurityAuth()
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // 获取所有请假数据
  @Get('list')
  @ApiOperation({ summary: '获取所有请假数据' })
  @Perm(permissions.READ)
  async getLeaveData() {
    return this.leaveService.getLeaveData()
  }

  // 新增请假
  @Post('create')
  @ApiOperation({ summary: '新增请假' })
  @Perm(permissions.CREATE)
  async addLeaveData(@Body() leaveData: any) {
    const applyCode = `LEAVE-${uniqueId()}`
    const approverStatus = 'pending'
    return this.leaveService.addLeaveData({
      ...leaveData,
      applyCode,
      approverStatus,
    }).then((res) => {
      const flowDesignCollect = new FlowDesignService()
      flowDesignCollect.find('680202abe57d75b4c219aeca').then((res: any) => {
        bootstrap('请假流程', res.xml).then((res) => {
          console.log(res)
        })
      })
      return res
    })
  }

  // 删除请假
  @Delete('delete')
  @ApiOperation({ summary: '删除请假' })
  @Perm(permissions.DELETE)
  async deleteLeaveData(@Body() leaveData: any) {
    const { id } = leaveData
    return this.leaveService.deleteLeaveData(id)
  }

  // 获取请假详情
  @Get('detail')
  @ApiOperation({ summary: '获取请假详情' })
  @Perm(permissions.READ)
  async getLeaveDataById(@Query('id') id: string) {
    return this.leaveService.getLeaveDataById(id)
  }

  // 审批请假
  @Post('approve')
  @ApiOperation({ summary: '审批请假' })
  @Perm(permissions.UPDATE)
  async approveLeaveData(@Body() leaveData: any) {
    const { id, approveData } = leaveData
    return this.leaveService.approveLeaveData(id, approveData)
  }

  // 驳回请假
  @Post('reject')
  @ApiOperation({ summary: '驳回请假' })
  @Perm(permissions.UPDATE)
  async rejectLeaveData(@Body() leaveData: any) {
    const { id, rejectData } = leaveData
    return this.leaveService.rejectLeaveData(id, rejectData)
  }
}
