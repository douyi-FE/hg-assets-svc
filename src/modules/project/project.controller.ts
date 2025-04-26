import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { ProjectService } from './project.service'

@ApiTags('项目管理')
@ApiSecurityAuth()
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取项目列表' })
  async list(@Query() dto: any) {
    const { name = '' } = dto
    return this.projectService.list()
  }

  @Post('data')
  @ApiOperation({ summary: '新增项目数据' })
  async addProject(@Body() body: any) {
    return this.projectService.insertProject(body)
  }

  @Delete('data')
  @ApiOperation({ summary: '删除项目数据' })
  async deleteProject(@Body() body: any) {
    return this.projectService.deleteProject(body.id)
  }
}
