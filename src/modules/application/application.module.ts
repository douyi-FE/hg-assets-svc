import { Module } from '@nestjs/common'
import { ApplicationController } from './application.control'
import { ApplicationService } from './application.service'

const services = [ApplicationService]

@Module({
  controllers: [ApplicationController],
  providers: [...services],
  exports: [...services],
})
export class ApplicationModule {}
