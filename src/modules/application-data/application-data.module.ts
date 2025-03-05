import { Module } from '@nestjs/common'
import { ApplicationDataController } from './application-data.control'
import { ApplicationDataService } from './application-data.service'

const services = [ApplicationDataService]

@Module({
  controllers: [ApplicationDataController],
  providers: [...services],
  exports: [...services],
})
export class ApplicationDataModule {}
