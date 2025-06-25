# OAuth2.0集成方案

## 概述

本文档描述了Node.js系统和Java OAuth2.0系统之间的单点登录集成方案。通过OAuth2.0适配器，将Node.js系统的认证数据转换为Java OAuth2.0格式。

## Java OAuth2.0系统Token结构

```java
// OAuth2AccessTokenDO 结构
- accessToken: String        // 访问令牌（UUID格式）
- refreshToken: String       // 刷新令牌（UUID格式）  
- userId: Long              // 用户编号
- userType: Integer         // 用户类型（1=管理员，2=会员）
- userInfo: Map<String,String> // 用户信息（昵称、部门等）
- clientId: String          // 客户端编号
- scopes: List<String>      // 授权范围
- expiresTime: LocalDateTime // 过期时间
- tenantId: Long            // 租户编号
```

## 参数匹配评估

### ✅ 可以提供的参数

1. **accessToken**: ✅ 可以提供
   - 生成UUID格式的访问令牌
   - 与Node.js JWT Token关联

2. **refreshToken**: ✅ 可以提供
   - 生成UUID格式的刷新令牌
   - 支持Token刷新功能

3. **userId**: ✅ 可以提供
   - Node.js系统的`UserEntity.id`字段

4. **userType**: ✅ 可以提供
   - 通过用户角色判断：管理员=1，会员=2
   - 基于`RoleEntity`和角色管理

5. **userInfo**: ✅ 可以提供
   - 丰富的用户信息：昵称、部门、邮箱、电话等
   - 转换为`Map<String,String>`格式

6. **scopes**: ✅ 可以提供
   - 将用户角色和权限映射为授权范围
   - 支持细粒度权限控制

7. **expiresTime**: ✅ 可以提供
   - 基于JWT过期时间计算
   - 转换为`LocalDateTime`格式

### ❌ 缺失的参数（已提供默认值）

1. **clientId**: ❌ 当前系统没有客户端管理
   - **解决方案**: 使用固定值`"nodejs-system"`

2. **tenantId**: ❌ 当前系统没有多租户功能
   - **解决方案**: 使用默认值`1`

## 集成方案

### 方案一：OAuth2.0适配器（推荐）

#### 1. 核心组件

**OAuth2AdapterService**: 负责Token格式转换
- `convertToOAuth2Format()`: 将Node.js Token转换为OAuth2.0格式
- `verifyOAuth2Token()`: 验证OAuth2.0 Token
- `generateOAuth2Token()`: 生成OAuth2.0格式的Token
- `refreshOAuth2Token()`: 刷新OAuth2.0 Token

**OAuth2AdapterController**: 提供API接口
- `POST /oauth2-adapter/convert-to-oauth2`: 转换Token格式
- `POST /oauth2-adapter/verify-oauth2-token`: 验证Token
- `POST /oauth2-adapter/generate-oauth2-token`: 生成Token
- `POST /oauth2-adapter/refresh-oauth2-token`: 刷新Token

#### 2. 使用方式

**Java系统调用Node.js转换API**:
```java
// 转换Node.js Token为OAuth2.0格式
POST http://nodejs-system:3000/oauth2-adapter/convert-to-oauth2
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应格式**:
```json
{
  "success": true,
  "oauth2Token": {
    "accessToken": "550e8400-e29b-41d4-a716-446655440000",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440001",
    "userId": 1,
    "userType": 1,
    "userInfo": {
      "nickname": "管理员",
      "deptName": "技术部",
      "email": "admin@example.com",
      "phone": "13800138000",
      "roles": "admin,user"
    },
    "clientId": "nodejs-system",
    "scopes": ["role:admin", "permission:system:user:list", "read", "write"],
    "expiresTime": "2024-01-01T12:00:00",
    "tenantId": 1
  }
}
```

### 方案二：直接Token验证

如果Java系统支持JWT验证，可以直接验证Node.js的JWT Token：

```java
@Component
public class NodejsTokenValidator {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    public OAuth2AccessTokenDO validateNodejsToken(String token) {
        // 直接验证JWT Token
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        
        // 转换为OAuth2.0格式
        OAuth2AccessTokenDO oauth2Token = new OAuth2AccessTokenDO();
        oauth2Token.setAccessToken(generateUUID());
        oauth2Token.setUserId(claims.get("uid", Long.class));
        oauth2Token.setUserType(determineUserType(claims.get("roles", List.class)));
        // ... 其他字段映射
        
        return oauth2Token;
    }
}
```

## API接口说明

### 1. 转换Token格式
```http
POST /oauth2-adapter/convert-to-oauth2
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 验证OAuth2.0 Token
```http
POST /oauth2-adapter/verify-oauth2-token
Content-Type: application/json

{
  "accessToken": "550e8400-e29b-41d4-a716-446655440000",
  "userId": 1,
  "clientId": "nodejs-system",
  "tenantId": 1
}
```

### 3. 生成OAuth2.0 Token
```http
POST /oauth2-adapter/generate-oauth2-token
Content-Type: application/json

{
  "uid": 1,
  "username": "admin",
  "roles": ["admin"],
  "permissions": ["system:user:list"]
}
```

### 4. 刷新Token
```http
POST /oauth2-adapter/refresh-oauth2-token
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}
```

## 字段映射关系

### 用户类型映射
```typescript
// Node.js角色 -> Java用户类型
admin角色 -> userType: 1 (管理员)
其他角色 -> userType: 2 (会员)
```

### 用户信息映射
```typescript
// Node.js用户信息 -> Java userInfo Map
nickname -> userInfo.nickname
dept.name -> userInfo.deptName
email -> userInfo.email
phone -> userInfo.phone
qq -> userInfo.qq
avatar -> userInfo.avatar
roles -> userInfo.roles
```

### 授权范围映射
```typescript
// Node.js权限 -> Java scopes
roles -> role:admin, role:user
permissions -> permission:system:user:list
默认 -> read, write
```

## 安全考虑

1. **Token安全**: 使用UUID格式的Token，避免JWT信息泄露
2. **过期时间**: 保持与JWT相同的过期时间
3. **刷新机制**: 支持Token刷新，提高安全性
4. **权限验证**: 完整的权限和角色验证
5. **黑名单**: 支持Token黑名单功能

## 部署配置

### 环境变量
```bash
# Node.js系统
JWT_SECRET=your-shared-secret-key
JWT_EXPIRE=7200
REDIS_HOST=localhost
REDIS_PORT=6379

# Java系统
NODEJS_SYSTEM_URL=http://nodejs-system:3000
OAUTH2_CLIENT_ID=nodejs-system
OAUTH2_TENANT_ID=1
```

### 网络配置
确保Java系统能够访问Node.js系统的OAuth2.0 API端点。

## 测试

### 1. 测试Token转换
```bash
curl -X POST http://localhost:3000/oauth2-adapter/convert-to-oauth2 \
  -H "Content-Type: application/json" \
  -d '{"token": "your-jwt-token"}'
```

### 2. 测试Token生成
```bash
curl -X POST http://localhost:3000/oauth2-adapter/generate-oauth2-token \
  -H "Content-Type: application/json" \
  -d '{
    "uid": 1,
    "username": "admin",
    "roles": ["admin"],
    "permissions": ["system:user:list"]
  }'
```

## 故障排除

### 1. Token转换失败
- 检查JWT Token是否有效
- 检查用户信息是否完整
- 检查权限数据是否正确

### 2. API调用失败
- 检查网络连接
- 检查服务是否正常运行
- 检查API端点是否正确

### 3. 权限问题
- 检查用户角色配置
- 检查权限映射关系
- 检查scope生成逻辑

## 总结

通过OAuth2.0适配器，Node.js系统可以完全满足Java OAuth2.0系统的Token格式要求：

- ✅ **所有必需参数**都可以提供
- ✅ **数据类型匹配**完全兼容
- ✅ **权限体系**完整映射
- ✅ **安全机制**保持一致
- ✅ **扩展性**良好，支持未来功能扩展

这个方案为两个系统之间的单点登录提供了完整、安全、可扩展的解决方案。 