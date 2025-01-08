import { Module } from '@nestjs/common'
import { FlowDesignController } from './flowDesign.controller'
import { FlowDesignService } from './flowDesign.service'

const services = [FlowDesignService]

@Module({
  controllers: [FlowDesignController],
  providers: [...services],
  exports: [...services],
})
export class FlowDesignModule {}
