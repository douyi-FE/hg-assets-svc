import { Module } from '@nestjs/common'
import { BuiltInController } from './builtin.controller'
import { BuiltInService } from './builtin.service'

const services = [BuiltInService]

@Module({
  controllers: [BuiltInController],
  providers: [...services],
  exports: [...services],
})
export class BuildInModule {}
