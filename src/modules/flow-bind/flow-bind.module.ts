import { Module } from '@nestjs/common'
import { FlowBindController } from './flow-bind.control'
import { FlowBindService } from './flow-bind.service'

const services = [FlowBindService]

@Module({
  controllers: [FlowBindController],
  providers: [...services],
  exports: [...services],
})
export class FlowBindModule {}
