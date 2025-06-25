/**
 * OAuth2.0 Token结构常量定义
 * 用于Node.js和Java OAuth2.0系统之间的Token结构对齐
 */

// Java OAuth2.0系统期望的Token结构
export const OAUTH2_TOKEN_STRUCTURE = {
  // 访问令牌（UUID格式）
  accessToken: 'string',
  
  // 刷新令牌（UUID格式）
  refreshToken: 'string',
  
  // 用户编号
  userId: 'number',
  
  // 用户类型（1=管理员，2=会员）
  userType: 'number',
  
  // 用户信息（昵称、部门等）
  userInfo: 'Map<string, string>',
  
  // 客户端编号
  clientId: 'string',
  
  // 授权范围
  scopes: 'string[]',
  
  // 过期时间
  expiresTime: 'LocalDateTime',
  
  // 租户编号
  tenantId: 'number',
} as const

// Node.js系统到OAuth2.0的字段映射
export const OAUTH2_FIELD_MAPPING = {
  // 用户ID映射
  'uid': 'userId',
  
  // 用户类型映射
  'roles': ['userType', 'scopes'], // 通过角色判断用户类型，同时转换为scope
  
  // 用户信息映射
  'nickname': 'userInfo.nickname',
  'dept.name': 'userInfo.deptName',
  'email': 'userInfo.email',
  'phone': 'userInfo.phone',
  'qq': 'userInfo.qq',
  'avatar': 'userInfo.avatar',
  
  // 权限映射
  'permissions': 'scopes', // 权限转换为scope
  
  // 时间映射
  'exp': 'expiresTime',
  
  // 固定值映射
  'clientId': 'nodejs-system',
  'tenantId': 1,
} as const

// 用户类型定义
export const USER_TYPE = {
  ADMIN: 1, // 管理员
  MEMBER: 2, // 会员
} as const

// 默认客户端配置
export const DEFAULT_CLIENT_CONFIG = {
  clientId: 'nodejs-system',
  clientSecret: 'nodejs-system-secret',
  clientName: 'Node.js System',
  clientDescription: 'Node.js系统客户端',
} as const

// 默认租户配置
export const DEFAULT_TENANT_CONFIG = {
  tenantId: 1,
  tenantName: '默认租户',
  tenantCode: 'default',
} as const

// OAuth2.0 API端点
export const OAUTH2_API_ENDPOINTS = {
  // 转换API
  convertToOAuth2: '/oauth2-adapter/convert-to-oauth2',
  generateOAuth2Token: '/oauth2-adapter/generate-oauth2-token',
  
  // 验证API
  verifyOAuth2Token: '/oauth2-adapter/verify-oauth2-token',
  
  // 刷新API
  refreshOAuth2Token: '/oauth2-adapter/refresh-oauth2-token',
  
  // 调试API
  oauth2TokenInfo: '/oauth2-adapter/oauth2-token-info',
} as const

// Scope定义
export const OAUTH2_SCOPES = {
  // 基础权限
  READ: 'read',
  WRITE: 'write',
  
  // 角色权限
  ROLE_ADMIN: 'role:admin',
  ROLE_USER: 'role:user',
  
  // 系统权限
  SYSTEM_USER_LIST: 'permission:system:user:list',
  SYSTEM_USER_CREATE: 'permission:system:user:create',
  SYSTEM_USER_READ: 'permission:system:user:read',
  SYSTEM_USER_UPDATE: 'permission:system:user:update',
  SYSTEM_USER_DELETE: 'permission:system:user:delete',
  
  // 流程权限
  FLOW_DESIGN: 'permission:flow:design',
  FLOW_APPROVAL: 'permission:flow:approval',
  FLOW_EXECUTE: 'permission:flow:execute',
} as const 