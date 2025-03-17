import { Module } from '@nestjs/common'
import { TemplateAttachController } from './templateAttach.controller'
import { TemplateAttachService } from './templateAttach.service'

const services = [TemplateAttachService]

@Module({
  controllers: [TemplateAttachController],
  providers: [...services],
  exports: [...services],
})
export class TemplateAttachModule {}
