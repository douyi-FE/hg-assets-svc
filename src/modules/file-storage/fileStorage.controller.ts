import { BadRequestException, Controller, Delete, Post, Req } from '@nestjs/common'
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'

import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'
import { FileStorageService } from './fileStorage.service'

export const permissions = definePermission('filestorage', {
  UPLOAD: 'upload',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('文件存储模块')
@Controller('filestorage')
export class FileStorageController {
  constructor(private fileStorageService: FileStorageService) {}

  @Post('upload')
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data')
  async upload(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const file = await req.file()
    try {
      const path = await this.fileStorageService.saveFileStorage(file, user.uid)

      return {
        filename: path,
      }
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException('上传失败')
    }
  }

  @Delete('delete')
  @Perm(permissions.DELETE)
  @ApiOperation({ summary: '文件删除' })
  async delete(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    const path = (req.query as { path: string }).path
    await this.fileStorageService.deleteFileStorage(path, user.uid)
    return {
      status: 'success',
    }
  }
}
