import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { FlowExecuteService } from './flowExecute.service'

@ApiTags('流程执行')
@ApiSecurityAuth()
@Controller('flow/execute')
export class FlowExecuteController {
  constructor(private flowExecuteService: FlowExecuteService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取流程执行列表' })
  async list(@Query() dto: any) {
    const { name = '' } = dto
    return this.flowExecuteService.list()
  }

  // 发起流程
  @Post('/create')
  @ApiOperation({ summary: '发起流程' })
  async create(@Body() body: any) {
    const { flowId, initiatorId, businessId } = body
    return this.flowExecuteService.create(flowId, initiatorId, businessId)
  }

  // 审批流程
  @Post('/approve')
  @ApiOperation({ summary: '审批流程' })
  async approve(@Body() body: any) {
    const { businessId, initiatorId } = body
    return this.flowExecuteService.approve(businessId, initiatorId)
  }

  // 驳回流程
  @Post('/reject')
  @ApiOperation({ summary: '驳回流程' })
  async reject(@Body() body: any) {
    const { businessId, initiatorId } = body
    return this.flowExecuteService.reject(businessId, initiatorId)
  }

  @Get('/find')
  @ApiOperation({ summary: '获取流程执行' })
  async find(@Query() dto) {
    const { id } = dto
    return this.flowExecuteService.find(id)
  }

  @Post('/save')
  @ApiOperation({ summary: '保存流程执行' })
  async save(@Body() body: any) {
    const { id, name, xml, note } = body
    return this.flowExecuteService.save(id, name, xml, note).then((res: any) => {
      if (res.message === 'callback is not a function') {
        return Promise.resolve({
          message: '成功',
        })
      }
      return {}
    })
  }

  @Delete('/delete')
  @ApiOperation({ summary: '删除流程执行' })
  async delete(@Query() dto: any) {
    const { id } = dto
    return this.flowExecuteService.delete(id)
  }
}
