import { BadRequestException, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { UsersService } from './users.service'

@ApiTags('用户信息管理')
@ApiSecurityAuth()
@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get('list')
  @ApiOperation({ summary: '获取用户列表' })
  async list(@Query() dto) {
    const { name = '' } = dto
    return this.UsersService.find(name)
  }

  @Post('/save')
  @ApiOperation({ summary: '保存用户信息' })
  async save(@Req() req: FastifyRequest) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const data = await req.file()
    const name = (data.fields.id as any).value
    const file = await (data.fields.sjs as any).toBuffer()
    return this.UsersService.save(name, file.toString('hex'))
  }
}
