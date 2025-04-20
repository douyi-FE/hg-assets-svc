import { Module } from '@nestjs/common'
import { LeaveController } from './leave.control'
import { LeaveService } from './leave.service'

const services = [LeaveService]

@Module({
  controllers: [LeaveController],
  providers: [...services],
  exports: [...services],
})
export class LeaveModule {}
