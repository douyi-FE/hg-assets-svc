import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Public } from '../decorators/public.decorator'
import { TokenAdapterService } from '../services/token-adapter.service'
import { TokenService } from '../services/token.service'
import { AuthService } from '../auth.service'
import { UserService } from '~/modules/user/user.service'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'
import Redis from 'ioredis'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'

@ApiTags('Token Adapter - Token适配器（Java系统专用）')
@Public()
@Controller('token-adapter')
export class TokenAdapterController {
  constructor(
    private tokenAdapterService: TokenAdapterService,
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('verify-nodejs-token')
  @ApiOperation({ summary: '验证Node.js Token（Java系统调用）' })
  @ApiResult({ type: Object })
  async verifyNodejsToken(@Body() body: { token: string }) {
    try {
      // 验证Node.js Token
      const payload = await this.tokenService.verifyAccessToken(body.token)
      
      // 检查token是否在黑名单中
      const isBlacklisted = await this.redis.get(genTokenBlacklistKey(body.token))
      if (isBlacklisted) {
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }

      // 检查密码版本
      const pv = await this.authService.getPasswordVersionByUid(payload.uid)
      if (pv !== `${payload.pv}`) {
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }

      // 获取用户详细信息
      const userInfo = await this.userService.getAccountInfo(payload.uid)
      
      // 转换为Java系统格式
      const javaFormat = await this.tokenAdapterService.convertToJavaFormat(body.token)
      
      return {
        valid: true,
        nodejsPayload: payload,
        javaFormat,
        userInfo,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  @Post('verify-java-token')
  @ApiOperation({ summary: '验证Java Token（Node.js系统调用）' })
  @ApiResult({ type: Object })
  async verifyJavaToken(@Body() body: { token: string }) {
    const result = await this.tokenAdapterService.verifyJavaToken(body.token)
    return result
  }

  @Get('token-info')
  @ApiOperation({ summary: '获取Token详细信息（调试用）' })
  @ApiResult({ type: Object })
  async getTokenInfo(@Query('token') token: string) {
    const info = await this.tokenAdapterService.getTokenInfo(token)
    return info
  }

  @Post('generate-compatible-token')
  @ApiOperation({ summary: '生成兼容Token（同时支持两个系统）' })
  @ApiResult({ type: Object })
  async generateCompatibleToken(@Body() body: {
    uid: number
    username: string
    roles: string[]
    permissions?: string[]
  }) {
    const result = await this.tokenAdapterService.generateCompatibleToken(body)
    return result
  }

  @Post('convert-to-java')
  @ApiOperation({ summary: '将Node.js Token转换为Java格式' })
  @ApiResult({ type: Object })
  async convertToJava(@Body() body: { token: string }) {
    try {
      const result = await this.tokenAdapterService.convertToJavaFormat(body.token)
      return {
        success: true,
        ...result,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
} 