import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { EngineerService } from './engineer.service'

@ApiTags('工程管理')
@ApiSecurityAuth()
@Controller('engineer')
export class EngineerController {
  constructor(private engineerService: EngineerService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取工程列表' })
  async list(@Query() dto: any) {
    const { deviceId = '' } = dto
    return this.engineerService.getEngineerListByDevice(deviceId)
  }

  @Post('data')
  @ApiOperation({ summary: '新增工程数据' })
  async addEngineer(@Body() body: any) {
    return this.engineerService.createEngineer(body)
  }

  @Delete('data')
  @ApiOperation({ summary: '删除工程数据' })
  async deleteEngineer(@Query() dto: any) {
    const { id = '' } = dto
    return this.engineerService.deleteEngineer(id)
  }

  // 更新工程
  @Put('data')
  @ApiOperation({ summary: '更新工程数据' })
  async updateEngineer(@Body() body: any) {
    const { id = '', ...rest } = body
    return this.engineerService.updateEngineer(id, rest)
  }
}
