import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { DeviceService } from './device.service'

@ApiTags('装置管理')
@ApiSecurityAuth()
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取装置列表' })
  async list(@Query() dto: any) {
    const { projectId = '' } = dto
    return this.deviceService.getDeviceListByProject(projectId)
  }

  @Post('data')
  @ApiOperation({ summary: '新增装置数据' })
  async addDevice(@Body() body: any) {
    return this.deviceService.createDevice(body)
  }

  @Delete('data')
  @ApiOperation({ summary: '删除装置数据' })
  async deleteDevice(@Query() dto: any) {
    const { id = '', code = '' } = dto
    return this.deviceService.deleteDevice(id, code)
  }

  // 更新装置
  @Put('data')
  @ApiOperation({ summary: '更新装置数据' })
  async updateDevice(@Body() body: any) {
    const { id = '', ...rest } = body
    return this.deviceService.updateDevice(id, rest)
  }
}
