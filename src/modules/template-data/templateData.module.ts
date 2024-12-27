import { Module } from '@nestjs/common'
import { TemplateDataController } from './templateData.controller'
import { TemplateDataService } from './templateData.service'

const services = [TemplateDataService]

@Module({
  controllers: [TemplateDataController],
  providers: [...services],
  exports: [...services],
})
export class TemplateDataModule {}
