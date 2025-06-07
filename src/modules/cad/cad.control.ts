import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { definePermission } from '../auth/decorators/permission.decorator'
import { CadService } from './cad.service'

export const permissions = definePermission('project:cad', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
})
@ApiTags('cad制图管理')
@ApiSecurityAuth()
@Controller('cad')
export class CadController {
  constructor(private readonly cadService: CadService) {}

  // 获取所有制图数 据
  @Get('list')
  @ApiOperation({ summary: '获取所有制图数据' })
  async getCadData(@Query() query: any) {
    const { name = '' } = query
    return this.cadService.getCadData({ name })
  }

  // 新增制图
  @Post('create')
  @ApiOperation({ summary: '新增制图' })
  async addCadData(@Body() cadData: any) {
    return this.cadService.addCadData(cadData)
  }

  // 更新制图
  @Post('update')
  @ApiOperation({ summary: '更新制图' })
  async updateCadData(@Body() cadData: any) {
    const { detailId: id, projectName: name, cadFileUrl: cadPath, excelEjs: ejs } = cadData
    return this.cadService.updateCadData(id, { name, cadPath, ejs })
  }

  // 删除制图
  @Delete('delete')
  @ApiOperation({ summary: '删除制图' })
  async deleteCadData(@Body() cadData: any) {
    const { id } = cadData
    return this.cadService.deleteCadData(id)
  }

  // 获取制图详情
  @Get('detail')
  @ApiOperation({ summary: '获取制图详情' })
  async getCadDataById(@Query('id') id: string) {
    return this.cadService.getCadDataById(id)
  }
}
