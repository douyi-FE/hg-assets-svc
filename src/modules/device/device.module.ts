import { Module } from '@nestjs/common'
import { DeviceController } from './device.controller'
import { DeviceService } from './device.service'

const services = [DeviceService]

@Module({
  controllers: [DeviceController],
  providers: [...services],
  exports: [...services],
})
export class DeviceModule {}
