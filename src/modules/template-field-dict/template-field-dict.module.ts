import { Module } from '@nestjs/common'
import { TemplateFieldDictController } from './template-field-dict.control'
import { TemplateFieldDictService } from './template-field-dict.service'

const services = [TemplateFieldDictService]

@Module({
  controllers: [TemplateFieldDictController],
  providers: [...services],
  exports: [...services],
})
export class TemplateFieldDictModule {}
