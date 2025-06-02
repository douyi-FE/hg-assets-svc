import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { nanoid } from 'nanoid'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '../auth/decorators/auth-user.decorator'
import { definePermission } from '../auth/decorators/permission.decorator'
import { UserService } from '../user/user.service'
import { LeaveService } from './leave.service'

export const permissions = definePermission('human:leave', {
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
  constructor(private readonly leaveService: LeaveService, private userService: UserService) {}

  // 获取所有请假数据
  @Get('list')
  @ApiOperation({ summary: '获取所有请假数据' })
  async getLeaveData(@AuthUser() user: IAuthUser) {
    const userInfo = await this.userService.getAccountInfo(user.uid)
    const leaveData = await this.leaveService.getLeaveData(userInfo)
    return leaveData.filter((item) => {
      return item
    })
  }

  // 新增请假
  @Post('create')
  @ApiOperation({ summary: '新增请假' })
  async addLeaveData(@Body() leaveData: any) {
    const applyCode = `LEAVE-${nanoid()}`
    const approverStatus = 'pending'
    const { flowId, initiatorId, ...rest } = leaveData
    return this.leaveService.addLeaveData({
      ...rest,
      applyCode,
      approverStatus,
    })
  }

  // 更新请假
  @Post('update')
  @ApiOperation({ summary: '更新请假' })
  async updateLeaveData(@Body() leaveData: any) {
    const { id, ...rest } = leaveData
    return this.leaveService.updateLeaveData(id, rest)
  }

  // 删除请假
  @Delete('delete')
  @ApiOperation({ summary: '删除请假' })
  async deleteLeaveData(@Body() leaveData: any) {
    const { id } = leaveData
    return this.leaveService.deleteLeaveData(id)
  }

  // 获取请假详情
  @Get('detail')
  @ApiOperation({ summary: '获取请假详情' })
  async getLeaveDataById(@Query('id') id: string) {
    return this.leaveService.getLeaveDataById(id)
  }

  // 审批请假
  @Post('approve')
  @ApiOperation({ summary: '审批请假' })
  async approveLeaveData(@Body() leaveData: any) {
    const { id, approveData } = leaveData
    return this.leaveService.approveLeaveData(id, approveData)
  }

  // 驳回请假
  @Post('reject')
  @ApiOperation({ summary: '驳回请假' })
  async rejectLeaveData(@Body() leaveData: any) {
    const { id } = leaveData
    return this.leaveService.rejectLeaveData(id)
  }
}
