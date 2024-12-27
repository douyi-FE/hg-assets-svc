import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const services = [UsersService]

@Module({
  controllers: [UsersController],
  providers: [...services],
  exports: [...services],
})
export class UsersModule {}
