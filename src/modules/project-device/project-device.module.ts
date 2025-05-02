import { Module } from '@nestjs/common'
import { ProjectDeviceController } from './project-device.control'
import { ProjectDeviceService } from './project-device.service'

const services = [ProjectDeviceService]

@Module({
  controllers: [ProjectDeviceController],
  providers: [...services],
  exports: [...services],
})
export class ProjectDeviceModule {}
