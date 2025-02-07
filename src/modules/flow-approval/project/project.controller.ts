import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

@ApiTags('项目审批')
@ApiSecurityAuth()
@Controller('flow/project')
export class ProjectController {
  constructor() {}

  @Get('/:id/state')
  @ApiOperation({ summary: '获取项目审批状态' })
  async state(@Param('id') id: string) {
    return {}
  }

  @Post('/:id/execute')
  @ApiOperation({ summary: '执行项目审批' })
  async execute(@Param('id') id: string, @Body() body: any) {
    return {}
  }
}
