import { Module } from '@nestjs/common'
import { TemplateVersionController } from './template-version.control'
import { TemplateVersionService } from './template-version.service'

const services = [TemplateVersionService]

@Module({
  controllers: [TemplateVersionController],
  providers: [...services],
  exports: [...services],
})
export class TemplateVersionModule {}
