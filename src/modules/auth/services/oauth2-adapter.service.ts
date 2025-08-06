import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { UserService } from '~/modules/user/user.service'
import { generateUUID } from '~/utils'
import { AuthService } from '../auth.service'
import { TokenService } from './token.service'

/**
 * OAuth2.0适配器服务
 * 将Node.js系统的认证数据转换为Java OAuth2.0格式
 */
@Injectable()
export class OAuth2AdapterService {
  constructor(
    private jwtService: JwtService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  /**
   * 将Node.js Token转换为OAuth2.0格式
   * @param nodejsToken Node.js系统的JWT Token
   * @returns OAuth2.0格式的Token信息
   */
  async convertToOAuth2Format(nodejsToken: string) {
    try {
      // 验证Node.js Token
      const payload = await this.jwtService.verifyAsync(nodejsToken)

      // 获取用户详细信息（包含角色信息）
      const userInfo = await this.userService.info(payload.uid)

      // 获取用户权限
      const permissions = await this.authService.getPermissions(payload.uid)

      // 判断用户类型
      const userType = this.determineUserType(userInfo.roles)

      // 构建用户信息Map
      const userInfoMap = this.buildUserInfoMap(userInfo)

      // 构建授权范围
      const scopes = this.buildScopes(userInfo.roles, permissions)

      // 生成OAuth2.0格式的Token
      const oauth2Token = {
        accessToken: generateUUID(), // 生成UUID格式的访问令牌
        refreshToken: generateUUID(), // 生成UUID格式的刷新令牌
        userId: payload.uid,
        userType,
        userInfo: userInfoMap,
        clientId: 'nodejs-system', // 固定客户端ID
        scopes,
        expiresTime: dayjs().add(this.securityConfig.jwtExprire, 'second').toDate(),
        tenantId: 1, // 默认租户ID
      }

      return {
        success: true,
        oauth2Token,
        originalPayload: payload,
      }
    }
    catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * 验证OAuth2.0 Token
   * @param oauth2Token OAuth2.0格式的Token
   * @returns 验证结果
   */
  async verifyOAuth2Token(oauth2Token: {
    accessToken: string
    userId: number
    clientId: string
    tenantId: number
  }) {
    try {
      // 这里可以添加OAuth2.0 Token的验证逻辑
      // 比如检查Token是否在数据库中，是否过期等

      const userInfo = await this.userService.getAccountInfo(oauth2Token.userId)

      return {
        valid: true,
        userInfo,
        token: oauth2Token,
      }
    }
    catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  /**
   * 生成OAuth2.0兼容的Token
   * @param userInfo 用户信息
   * @returns OAuth2.0格式的Token
   */
  async generateOAuth2Token(userInfo: {
    uid: number
    username: string
    roles: string[]
    permissions?: string[]
  }) {
    const permissions = await this.authService.getPermissions(userInfo.uid)
    const userType = this.determineUserType(userInfo.roles)
    const userInfoMap = await this.buildUserInfoMapFromUid(userInfo.uid)
    const scopes = this.buildScopes(userInfo.roles, permissions)

    return {
      accessToken: generateUUID(),
      refreshToken: generateUUID(),
      userId: userInfo.uid,
      userType,
      userInfo: userInfoMap,
      clientId: 'nodejs-system',
      scopes,
      expiresTime: dayjs().add(this.securityConfig.jwtExprire, 'second').toDate(),
      tenantId: 1,
    }
  }

  /**
   * 判断用户类型
   * @param roles 用户角色
   * @returns 用户类型：1=管理员，2=会员
   */
  private determineUserType(roles: any[]): number {
    if (!roles || roles.length === 0) {
      return 2 // 默认会员
    }

    // 检查是否有管理员角色
    const hasAdminRole = roles.some(role =>
      role.value === 'admin' || role.id === 1 || role.name?.includes('管理员'),
    )

    return hasAdminRole ? 1 : 2
  }

  /**
   * 构建用户信息Map
   * @param userInfo 用户信息
   * @returns 用户信息Map
   */
  private buildUserInfoMap(userInfo: any): Map<string, string> {
    const userInfoMap = new Map<string, string>()

    if (userInfo.username) {
      userInfoMap.set('username', userInfo.username)
    }

    if (userInfo.nickname) {
      userInfoMap.set('nickname', userInfo.nickname)
    }

    if (userInfo.dept?.name) {
      userInfoMap.set('deptName', userInfo.dept.name)
    }

    if (userInfo.email) {
      userInfoMap.set('email', userInfo.email)
    }

    if (userInfo.phone) {
      userInfoMap.set('phone', userInfo.phone)
    }

    if (userInfo.qq) {
      userInfoMap.set('qq', userInfo.qq)
    }

    if (userInfo.avatar) {
      userInfoMap.set('avatar', userInfo.avatar)
    }

    // 添加角色信息
    if (userInfo.roles && userInfo.roles.length > 0) {
      const roleNames = userInfo.roles.map(role => role.name || role.value).join(',')
      userInfoMap.set('roles', roleNames)
    }

    return userInfoMap
  }

  /**
   * 从用户ID构建用户信息Map
   * @param uid 用户ID
   * @returns 用户信息Map
   */
  private async buildUserInfoMapFromUid(uid: number): Promise<Map<string, string>> {
    const userInfo = await this.userService.getAccountInfo(uid)
    return this.buildUserInfoMap(userInfo)
  }

  /**
   * 构建授权范围
   * @param roles 用户角色
   * @param permissions 用户权限
   * @returns 授权范围列表
   */
  private buildScopes(roles: any[], permissions: string[]): string[] {
    const scopes: string[] = []

    // 添加角色作为scope
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        if (role.value) {
          scopes.push(`role:${role.value}`)
        }
      })
    }

    // 添加权限作为scope
    if (permissions && permissions.length > 0) {
      permissions.forEach((permission) => {
        scopes.push(`permission:${permission}`)
      })
    }

    // 添加默认scope
    scopes.push('read', 'write')

    return scopes
  }

  /**
   * 刷新OAuth2.0 Token
   * @param refreshToken 刷新令牌
   * @returns 新的Token信息
   */
  async refreshOAuth2Token(refreshToken: string) {
    try {
      // 这里应该验证refreshToken的有效性
      // 暂时返回错误，需要实现refreshToken的存储和验证
      return {
        success: false,
        error: 'Refresh token validation not implemented yet',
      }
    }
    catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
