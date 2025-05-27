import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { FlowAuthUtil } from '~/utils/flow-auth.util'
import { DeptModule } from '../system/dept/dept.module'
import { DeptService } from '../system/dept/dept.service'
import { UserModule } from '../user/user.module'
import { LeaveController } from './leave.control'
import { LeaveService } from './leave.service'

const services = [LeaveService]

@Module({
  imports: [UserModule, DeptModule, RouterModule.register([
    {
      path: '',
      module: LeaveModule,
    },
  ])],
  controllers: [LeaveController],
  providers: [...services, FlowAuthUtil, DeptService],
  exports: [...services],
})
export class LeaveModule {}
