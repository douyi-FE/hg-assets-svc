import { Module } from '@nestjs/common'
import { OutputValueController } from './output-value.control'

const services = []

@Module({
  controllers: [OutputValueController],
  providers: [...services],
  exports: [...services],
})
export class OutputValueModule {}
