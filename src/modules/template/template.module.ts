import { Module } from '@nestjs/common'
import { TemplateController } from './template.controller'
import { TemplateService } from './template.service'

const services = [TemplateService]

@Module({
  controllers: [TemplateController],
  providers: [...services],
  exports: [...services],
})
export class TemplateModule {}
