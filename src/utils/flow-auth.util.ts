/**
 * 工作流权限模块
 */
import { Injectable } from '@nestjs/common'
import { DeptService } from '~/modules/system/dept/dept.service'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class FlowAuthUtil {
  constructor(private readonly deptService: DeptService, private readonly userService: UserService) {}

  // 发起申请直接过
  async isInitiatorDirectPass() {
    return true
  }

  // 直属领导审批
  isDirectLeader(userInfo: any, initiatorDeptList: any[]) {
    return initiatorDeptList.filter(it => it.roles.filter(role => role.value === 'teamLeader').length > 0).find(it => it.id.toString() === userInfo.id.toString()) !== undefined
  }

  // 部门领导审批
  async isDepartmentLeader(userInfo: any, initiatorDeptList: any[]) {
    console.log('isDepartmentLeader', userInfo, initiatorDeptList)
    return true
  }

  // 指定人审批
  async isAssignee() {
    return true
  }

  // 判断是否有节点审批权限
  async hasNodeApprovalPermission(userInfo: any, record: any, tasks: any) {
    const { initiatorId, employeeId } = record
    const initiatorInfo: any = await this.userService.getAccountInfo(initiatorId)
    const { items: initiatorDeptList = [] } = await this.userService.list({ deptId: initiatorInfo.dept.id })

    // 发起人是当前用户直接过
    if (employeeId.toString() === userInfo.id.toString()) {
      return true
    }

    // 没有任务，代表审批完成，如果是操作人，则直接过
    if (tasks.length === 0) {
      return employeeId.toString() === userInfo.id.toString()
    }

    // 有任务，判断是否需要审批
    const { properties = {}, name } = tasks[0] || {}
    if (name === '发起申请') {
      return this.isInitiatorDirectPass()
    }
    else {
      switch (properties.approverRole) {
        case 'leader':
          return this.isDirectLeader(userInfo, initiatorDeptList)
        case 'department':
          return this.isDepartmentLeader(userInfo, initiatorDeptList)
        case 'approver':
          return this.isAssignee()
      }
    }
  }
}
