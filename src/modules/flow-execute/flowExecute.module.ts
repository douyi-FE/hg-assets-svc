import { Module } from '@nestjs/common'
import { FlowExecuteController } from './flowExecute.controller'
import { FlowExecuteService } from './flowExecute.service'

const services = [FlowExecuteService]

@Module({
  controllers: [FlowExecuteController],
  providers: [...services],
  exports: [...services],
})
export class FlowExecuteModule {}
