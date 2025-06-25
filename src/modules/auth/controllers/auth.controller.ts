import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Ip } from '~/common/decorators/http.decorator'

import { UserService } from '~/modules/user/user.service'

import { AuthService } from '../auth.service'
import { Public } from '../decorators/public.decorator'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { LocalGuard } from '../guards/local.guard'
import { LoginToken } from '../models/auth.model'
import { CaptchaService } from '../services/captcha.service'
import { TokenService } from '../services/token.service'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'
import Redis from 'ioredis'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
    private tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginToken })
  async login(@Body() dto: LoginDto, @Ip()ip: string, @Headers('user-agent')ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode)
    const token = await this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    )
    return { token }
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.userService.register(dto)
  }

  @Post('verify-token')
  @ApiOperation({ summary: '验证Token（供Java系统调用）' })
  @ApiResult({ type: Object })
  async verifyToken(@Body() body: { token: string }) {
    try {
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
      
      return {
        valid: true,
        payload,
        userInfo,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }
} 