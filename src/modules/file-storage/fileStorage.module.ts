import { Module } from '@nestjs/common'
import { FileStorageController } from './fileStorage.controller'
import { FileStorageService } from './fileStorage.service'

const services = [FileStorageService]

@Module({
  controllers: [FileStorageController],
  providers: [...services],
  exports: [...services],
})
export class FileStorageModule {}
