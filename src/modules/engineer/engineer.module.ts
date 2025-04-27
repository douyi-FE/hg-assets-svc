import { Module } from '@nestjs/common'
import { EngineerController } from './engineer.controller'
import { EngineerService } from './engineer.service'

const services = [EngineerService]

@Module({
  controllers: [EngineerController],
  providers: [...services],
  exports: [...services],
})
export class EngineerModule {}
