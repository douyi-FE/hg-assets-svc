import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Public } from '../decorators/public.decorator'
import { OAuth2AdapterService } from '../services/oauth2-adapter.service'
import { TokenService } from '../services/token.service'
import { AuthService } from '../auth.service'
import { UserService } from '~/modules/user/user.service'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'
import Redis from 'ioredis'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'

@ApiTags('OAuth2 Adapter - OAuth2.0适配器（Java系统专用）')
@Public()
@Controller('oauth2-adapter')
export class OAuth2AdapterController {
  constructor(
    private oauth2AdapterService: OAuth2AdapterService,
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('convert-to-oauth2')
  @ApiOperation({ summary: '将Node.js Token转换为OAuth2.0格式' })
  @ApiResult({ type: Object })
  async convertToOAuth2(@Body() body: { token: string }) {
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

      // 转换为OAuth2.0格式
      const result = await this.oauth2AdapterService.convertToOAuth2Format(body.token)
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @Post('verify-oauth2-token')
  @ApiOperation({ summary: '验证OAuth2.0 Token' })
  @ApiResult({ type: Object })
  async verifyOAuth2Token(@Body() body: {
    accessToken: string
    userId: number
    clientId: string
    tenantId: number
  }) {
    const result = await this.oauth2AdapterService.verifyOAuth2Token(body)
    return result
  }

  @Post('generate-oauth2-token')
  @ApiOperation({ summary: '生成OAuth2.0格式的Token' })
  @ApiResult({ type: Object })
  async generateOAuth2Token(@Body() body: {
    uid: number
    username: string
    roles: string[]
    permissions?: string[]
  }) {
    try {
      const result = await this.oauth2AdapterService.generateOAuth2Token(body)
      return {
        success: true,
        oauth2Token: result,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @Post('refresh-oauth2-token')
  @ApiOperation({ summary: '刷新OAuth2.0 Token' })
  @ApiResult({ type: Object })
  async refreshOAuth2Token(@Body() body: { refreshToken: string }) {
    const result = await this.oauth2AdapterService.refreshOAuth2Token(body.refreshToken)
    return result
  }

  @Get('oauth2-token-info')
  @ApiOperation({ summary: '获取OAuth2.0 Token信息（调试用）' })
  @ApiResult({ type: Object })
  async getOAuth2TokenInfo(@Query('token') token: string) {
    try {
      // 先转换为OAuth2.0格式，然后返回信息
      const result = await this.oauth2AdapterService.convertToOAuth2Format(token)
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
} 