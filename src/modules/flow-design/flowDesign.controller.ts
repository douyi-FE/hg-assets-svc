import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { FlowDesignService } from './flowDesign.service'

@ApiTags('流程设计')
@ApiSecurityAuth()
@Controller('flow/design')
export class FlowDesignController {
  constructor(private flowDesignService: FlowDesignService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取流程设计列表' })
  async list() {
    return this.flowDesignService.list()
  }

  @Get('/find')
  @ApiOperation({ summary: '获取流程设计' })
  async find(@Query() dto) {
    const { id } = dto
    return this.flowDesignService.find(id)
  }

  @Post('/save')
  @ApiOperation({ summary: '保存流程设计' })
  async save(@Body() body: any) {
    const { id, name, xml, note } = body
    return this.flowDesignService.save(id, name, xml, note).then((res: any) => {
      if (res.message === 'callback is not a function') {
        return Promise.resolve({
          message: '成功',
        })
      }
      return {}
    })
  }

  @Delete('/delete')
  @ApiOperation({ summary: '删除流程设计' })
  async delete(@Query() dto: any) {
    const { id } = dto
    return this.flowDesignService.delete(id)
  }
}
