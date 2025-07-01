import { Module } from '@nestjs/common'
import { ApplicationDataHistoryController } from './application-data-history.control'
import { ApplicationDataHistoryService } from './application-data-history.service'

const services = [ApplicationDataHistoryService]

@Module({
  controllers: [ApplicationDataHistoryController],
  providers: [...services],
  exports: [...services],
})
export class ApplicationDataHistoryModule {}
