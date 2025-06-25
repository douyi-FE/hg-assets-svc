# 文件上传大小限制修复说明

## 问题描述
当前系统在文件上传时出现 "Request body is too large" 错误，特别是对于大于1MB的文件。客户需要支持最大200MB的文件上传。

## 修改内容

### 1. Fastify 配置修改
**文件**: `src/common/adapters/fastify.adapter.ts`

- 增加请求体大小限制到200MB: `bodyLimit: 200 * 1024 * 1024`
- 增加连接超时时间到5分钟: `connectionTimeout: 300000`
- 增加保持连接超时时间到5分钟: `keepAliveTimeout: 300000`
- 修改multipart文件大小限制到200MB: `fileSize: 200 * 1024 * 1024`

### 2. 应用超时配置修改
**文件**: `src/app.module.ts`

- 将全局超时拦截器时间从15秒增加到10分钟: `new TimeoutInterceptor(10 * 60 * 1000)`

### 3. 模板附件上传接口优化
**文件**: `src/modules/template-attach/templateAttach.controller.ts`

- 添加对multipart/form-data格式的支持
- 保持对JSON格式的向后兼容性
- 添加错误处理和日志记录
- 支持单文件上传处理

### 4. 文件上传DTO修改
**文件**: `src/modules/tools/upload/upload.dto.ts`

- 将文件大小限制从10MB增加到200MB: `fileSize: 200 * 1024 * 1024`

### 5. 网盘服务修改
**文件**: `src/modules/netdisk/manager/manage.service.ts`

- 将七牛云上传token的文件大小限制从10MB增加到200MB: `fsizeLimit: 200 * 1024 * 1024`

### 6. Nginx配置修改
**文件**: `deploy/web/default.conf`

- 添加客户端请求体大小限制: `client_max_body_size 200M`
- 增加代理超时时间到10分钟:
  - `proxy_read_timeout 600s`
  - `proxy_send_timeout 600s`
  - `proxy_connect_timeout 600s`

## 修改后的限制

| 组件 | 原限制 | 新限制 |
|------|--------|--------|
| Fastify bodyLimit | 默认 | 200MB |
| Fastify multipart fileSize | 30MB | 200MB |
| 应用超时时间 | 15秒 | 10分钟 |
| 文件上传DTO | 10MB | 200MB |
| 七牛云上传 | 10MB | 200MB |
| Nginx client_max_body_size | 默认 | 200MB |
| Nginx代理超时 | 默认 | 10分钟 |

## 测试建议

1. 测试小文件上传（< 1MB）确保功能正常
2. 测试中等文件上传（10-50MB）验证性能
3. 测试大文件上传（100-200MB）验证限制是否生效
4. 测试超时情况，确保大文件上传不会因为超时而失败

## 注意事项

1. 大文件上传会增加服务器内存使用量
2. 建议监控服务器资源使用情况
3. 可能需要调整数据库配置以支持大文件存储
4. 建议在前端添加文件大小检查和上传进度提示 