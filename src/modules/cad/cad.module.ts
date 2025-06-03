import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { FlowAuthUtil } from '~/utils/flow-auth.util'
import { DeptModule } from '../system/dept/dept.module'
import { DeptService } from '../system/dept/dept.service'
import { UserModule } from '../user/user.module'
import { CadController } from './cad.control'
import { CadService } from './cad.service'

const services = [CadService]

@Module({
  imports: [UserModule, DeptModule, RouterModule.register([
    {
      path: '',
      module: CadModule,
    },
  ])],
  controllers: [CadController],
  providers: [...services, FlowAuthUtil, DeptService],
  exports: [...services],
})
export class CadModule {}
