import { Module } from '@nestjs/common'
import { FlowApprovalController } from './flow-approval.controller'
import { FlowApprovalService } from './flow-approval.service'

@Module({
  controllers: [FlowApprovalController],
  providers: [FlowApprovalService],
})
export class FlowApprovalModule {}
