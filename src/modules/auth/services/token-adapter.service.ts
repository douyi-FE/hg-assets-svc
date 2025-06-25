import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { Inject } from '@nestjs/common'

/**
 * Token适配器服务
 * 用于处理Node.js和Java系统之间的Token结构转换
 */
@Injectable()
export class TokenAdapterService {
  constructor(
    private jwtService: JwtService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  /**
   * 将Node.js的Token转换为Java系统可用的格式
   * @param nodejsToken Node.js系统的JWT Token
   * @returns Java系统格式的Token信息
   */
  async convertToJavaFormat(nodejsToken: string) {
    try {
      // 验证Node.js Token
      const payload = await this.jwtService.verifyAsync(nodejsToken)
      
      // 转换为Java系统期望的格式
      const javaPayload = {
        // 标准JWT字段
        sub: payload.uid.toString(), // 用户ID作为subject
        iat: payload.iat, // 签发时间
        exp: payload.exp, // 过期时间
        
        // 自定义字段
        userId: payload.uid,
        username: payload.username || '', // 如果payload中没有，需要从数据库获取
        roles: payload.roles || [],
        permissions: payload.permissions || [], // 如果payload中没有，需要从数据库获取
        
        // 系统标识
        issuer: 'nodejs-system',
        audience: 'java-system',
        
        // 其他Java系统可能需要的字段
        passwordVersion: payload.pv,
        loginTime: payload.iat,
        lastAccessTime: Math.floor(Date.now() / 1000),
      }

      // 使用相同的密钥生成Java格式的Token
      const javaToken = await this.jwtService.signAsync(javaPayload, {
        secret: this.securityConfig.jwtSecret,
        expiresIn: `${this.securityConfig.jwtExprire}s`,
      })

      return {
        token: javaToken,
        payload: javaPayload,
        originalPayload: payload,
      }
    } catch (error) {
      throw new Error(`Token转换失败: ${error.message}`)
    }
  }

  /**
   * 验证Java系统发送的Token
   * @param javaToken Java系统的JWT Token
   * @returns 验证结果和用户信息
   */
  async verifyJavaToken(javaToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(javaToken)
      
      return {
        valid: true,
        payload,
        userId: payload.userId || payload.sub,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  /**
   * 获取Token的详细信息（用于调试）
   * @param token JWT Token
   * @returns Token的详细信息
   */
  async getTokenInfo(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token)
      const header = this.jwtService.decode(token, { complete: true })
      
      return {
        header: header.header,
        payload,
        algorithm: header.header.alg,
        type: header.header.typ,
      }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }

  /**
   * 生成兼容的Token（同时支持Node.js和Java系统）
   * @param userInfo 用户信息
   * @returns 兼容的Token
   */
  async generateCompatibleToken(userInfo: {
    uid: number
    username: string
    roles: string[]
    permissions?: string[]
  }) {
    const payload = {
      // Node.js系统字段
      uid: userInfo.uid,
      pv: 1,
      roles: userInfo.roles,
      
      // Java系统字段
      sub: userInfo.uid.toString(),
      userId: userInfo.uid,
      username: userInfo.username,
      permissions: userInfo.permissions || [],
      
      // 标准JWT字段
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.securityConfig.jwtExprire,
      
      // 系统标识
      issuer: 'compatible-system',
      audience: ['nodejs-system', 'java-system'],
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.jwtSecret,
      expiresIn: `${this.securityConfig.jwtExprire}s`,
    })

    return {
      token,
      payload,
    }
  }
} 