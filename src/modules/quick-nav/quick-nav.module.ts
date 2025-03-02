import { Module } from '@nestjs/common'
import { QuickNavController } from './quick-nav.control'
import { QuickNavService } from './quick-nav.service'

const services = [QuickNavService]

@Module({
  controllers: [QuickNavController],
  providers: [...services],
  exports: [...services],
})
export class QuickNavModule {}
