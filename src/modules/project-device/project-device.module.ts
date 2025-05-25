import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ProjectDeviceController } from './project-device.control'
import { ProjectDeviceService } from './project-device.service'

const services = [ProjectDeviceService]

@Module({
  imports: [UserModule],
  controllers: [ProjectDeviceController],
  providers: [...services],
  exports: [...services],
})
export class ProjectDeviceModule {}
