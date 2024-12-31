import { Module } from '@nestjs/common'
import { TemplateWordController } from './template-word.controller'
import { TemplateWordService } from './template-word.service'

const services = [TemplateWordService]

@Module({
  controllers: [TemplateWordController],
  providers: [...services],
  exports: [...services],
})
export class TemplateWordModule {}
