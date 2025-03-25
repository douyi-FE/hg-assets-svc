import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FlowApprovalService } from './flow-approval.service'

@ApiTags('流程审批')
@Controller('flow-approval')
export class FlowApprovalController {
  constructor(private readonly flowApprovalService: FlowApprovalService) {}

  @Get('info')
  async getFlowApprovalInfo(@Query() query: any) {
    const { processId } = query
    return this.flowApprovalService.getFlowApprovalInfo(processId)
  }
}
