import { Module } from '@nestjs/common'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

const services = [ProjectService]

@Module({
  controllers: [ProjectController],
  providers: [...services],
  exports: [...services],
})
export class ProjectModule {}
