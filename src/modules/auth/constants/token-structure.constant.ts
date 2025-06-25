/**
 * Token结构常量定义
 * 用于Node.js和Java系统之间的Token结构对齐
 */

// Node.js系统当前使用的Token结构
export const NODEJS_TOKEN_STRUCTURE = {
  // 标准JWT字段
  iat: 'number', // 签发时间
  exp: 'number', // 过期时间
  
  // 自定义字段
  uid: 'number', // 用户ID
  pv: 'number',  // 密码版本号
  roles: 'string[]', // 用户角色列表
} as const

// Java系统期望的Token结构
export const JAVA_TOKEN_STRUCTURE = {
  // 标准JWT字段
  sub: 'string', // 用户ID作为subject
  iat: 'number', // 签发时间
  exp: 'number', // 过期时间
  
  // 自定义字段
  userId: 'number', // 用户ID
  username: 'string', // 用户名
  roles: 'string[]', // 用户角色列表
  permissions: 'string[]', // 用户权限列表
  
  // 系统标识
  issuer: 'string', // 签发者
  audience: 'string', // 受众
  
  // 其他字段
  passwordVersion: 'number', // 密码版本号
  loginTime: 'number', // 登录时间
  lastAccessTime: 'number', // 最后访问时间
} as const

// 兼容的Token结构（同时支持两个系统）
export const COMPATIBLE_TOKEN_STRUCTURE = {
  // Node.js系统字段
  uid: 'number',
  pv: 'number',
  roles: 'string[]',
  
  // Java系统字段
  sub: 'string',
  userId: 'number',
  username: 'string',
  permissions: 'string[]',
  
  // 标准JWT字段
  iat: 'number',
  exp: 'number',
  
  // 系统标识
  issuer: 'string',
  audience: 'string[]',
} as const

// Token转换映射关系
export const TOKEN_FIELD_MAPPING = {
  // Node.js -> Java
  'uid': ['userId', 'sub'],
  'pv': 'passwordVersion',
  'roles': 'roles',
  'iat': 'iat',
  'exp': 'exp',
  
  // Java -> Node.js
  'userId': 'uid',
  'sub': 'uid',
  'passwordVersion': 'pv',
  'permissions': 'permissions', // 需要从数据库获取
} as const

// JWT配置信息
export const JWT_CONFIG = {
  algorithm: 'HS256',
  tokenType: 'Bearer',
  headerName: 'Authorization',
  queryParamName: 'token',
} as const

// API端点
export const TOKEN_API_ENDPOINTS = {
  // Node.js系统提供的API
  verifyNodejsToken: '/token-adapter/verify-nodejs-token',
  verifyJavaToken: '/token-adapter/verify-java-token',
  convertToJava: '/token-adapter/convert-to-java',
  generateCompatibleToken: '/token-adapter/generate-compatible-token',
  tokenInfo: '/token-adapter/token-info',
  
  // 备用API
  verifyToken: '/auth/verify-token',
} as const 