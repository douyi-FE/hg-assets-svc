import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { LogModule } from '../system/log/log.module'
import { MenuModule } from '../system/menu/menu.module'
import { RoleModule } from '../system/role/role.module'
import { UserModule } from '../user/user.module'

import { AuthService } from './auth.service'
import { AuthController } from './controllers/auth.controller'
import { AccountController } from './controllers/account.controller'
import { CaptchaController } from './controllers/captcha.controller'
import { EmailController } from './controllers/email.controller'
import { TokenAdapterController } from './controllers/token-adapter.controller'
import { OAuth2AdapterController } from './controllers/oauth2-adapter.controller'
import { AccessTokenEntity } from './entities/access-token.entity'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { CaptchaService } from './services/captcha.service'
import { TokenService } from './services/token.service'
import { TokenAdapterService } from './services/token-adapter.service'
import { OAuth2AdapterService } from './services/oauth2-adapter.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

const controllers = [
  AuthController,
  AccountController,
  CaptchaController,
  EmailController,
  TokenAdapterController,
  OAuth2AdapterController,
]
const providers = [AuthService, TokenService, CaptchaService, TokenAdapterService, OAuth2AdapterService]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire }
          = configService.get<ISecurityConfig>('security')

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: isDev,
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    MenuModule,
    LogModule,
  ],
  controllers: [...controllers],
  providers: [...providers, ...strategies],
  exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
