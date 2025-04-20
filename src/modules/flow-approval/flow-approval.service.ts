import { Injectable } from '@nestjs/common'

@Injectable()
export class FlowApprovalService {
  constructor() {}

  async getFlowApprovalInfo(processId: string) {
    return {
      applyCode: '1234567890',
      result: [
        {
          approvalType: '发起',
          approvalDate: '2025-03-24',
          opinion: '同意',
          result: '同意',
          initiator: '张三',
          approver: '李四',
          startTime: '2025-03-24',
          endTime: '2025-03-24',
        },
        {
          approvalType: '直属领导审批',
          approvalDate: '2025-03-24',
          opinion: '同意',
          result: '同意',
          initiator: '张三',
          approver: '李四',
          startTime: '2025-03-24',
          endTime: '2025-03-24',
        },
        {
          approvalType: '财务审批',
          approvalDate: '2025-03-24',
          opinion: '同意',
          result: '同意',
          initiator: '张三',
          approver: '李四',
          startTime: '2025-03-24',
          endTime: '2025-03-24',
        },
        {
          approvalType: '财务领导审批',
          approvalDate: '2025-03-24',
          opinion: '同意',
          result: '同意',
          initiator: '张三',
          approver: '李四',
          startTime: '2025-03-24',
          endTime: '2025-03-24',
        },
      ],
    }
  }
}
