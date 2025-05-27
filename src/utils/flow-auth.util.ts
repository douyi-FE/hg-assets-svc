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
  async isDepartmentLeader() {
    return true
  }

  // 指定人审批
  async isAssignee() {
    return true
  }

  // 判断是否有节点审批权限
  async hasNodeApprovalPermission(userInfo: any, initiatorId: any, nodeProperties: any) {
    const initiatorInfo: any = await this.userService.getAccountInfo(initiatorId)
    const { items: initiatorDeptList = [] } = await this.userService.list({ deptId: initiatorInfo.dept.id })

    const { properties = {}, name } = nodeProperties[0] || {}
    if (name === '发起申请') {
      return this.isInitiatorDirectPass()
    }
    else {
      switch (properties.approverRole) {
        case 'leader':
          return this.isDirectLeader(userInfo, initiatorDeptList)
        case 'department':
          return this.isDepartmentLeader()
        case 'approver':
          return this.isAssignee()
      }
    }
  }
}
