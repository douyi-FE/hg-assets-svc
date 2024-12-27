import { BadRequestException, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { BuiltInService } from './builtin.service'

@ApiTags('内置ejs')
@ApiSecurityAuth()
@Controller('builtin')
export class BuiltInController {
  constructor(private builtInService: BuiltInService) {}

  @Get('/ejs')
  @ApiOperation({ summary: '获取ejs' })
  async list(@Query() dto) {
    const { name = '' } = dto
    return this.builtInService.find(name)
  }

  @Post('/save')
  @ApiOperation({ summary: '保存ejs' })
  async save(@Req() req: FastifyRequest) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const data = await req.file()
    const name = (data.fields.name as any).value
    const file = await (data.fields.sjs as any).toBuffer()
    return this.builtInService.save(name, file.toString('hex'))
  }
}
