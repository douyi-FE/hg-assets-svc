# Gzip 压缩功能实现文档

## 概述

为了提高大数据量接口的网络传输效率，本项目已集成 Gzip 压缩功能。当响应数据超过 1KB 时，系统会自动启用 Gzip 压缩，通常可以压缩 60-80% 的数据量。

## 实现方案

### 技术栈
- **框架**: NestJS + Fastify
- **压缩插件**: @fastify/compress
- **压缩算法**: Gzip, Deflate

### 配置详情

在 `src/common/adapters/fastify.adapter.ts` 中配置了压缩插件：

```typescript
app.register(fastifyCompress, {
  // 启用 gzip 压缩
  global: true,
  // 压缩阈值：1KB 以上的响应才进行压缩
  threshold: 1024,
  // 支持的压缩类型
  encodings: ['gzip', 'deflate'],
  // 自定义压缩选项
  zlibOptions: {
    level: 6, // 压缩级别 (1-9, 9为最高压缩率但最慢)
  },
})
```

### 配置参数说明

- **global**: 全局启用压缩
- **threshold**: 压缩阈值，1KB 以上的响应才压缩
- **encodings**: 支持的压缩类型，按优先级排序
- **zlibOptions.level**: 压缩级别，6 是平衡压缩率和性能的最佳选择

## 前端兼容性

### 自动处理
现代浏览器会自动处理 Gzip 压缩：
- 发送请求时自动添加 `Accept-Encoding: gzip, deflate` 头
- 接收响应时自动解压数据
- 前端代码无需任何修改

### 手动处理（如果需要）
如果需要手动处理压缩，可以检查响应头：

```javascript
fetch('/api/project-device/data')
  .then(response => {
    const encoding = response.headers.get('content-encoding')
    if (encoding === 'gzip') {
      console.log('响应使用了 Gzip 压缩')
    }
    return response.json()
  })
```

## 测试验证

### 使用测试脚本
运行 `test-compression.js` 来验证压缩功能：

```bash
node test-compression.js
```

### 手动测试
使用 curl 命令测试：

```bash
# 测试压缩
curl -H "Accept-Encoding: gzip" -I http://localhost:3000/api/project-device/data

# 查看响应头
curl -H "Accept-Encoding: gzip" -v http://localhost:3000/api/project-device/data
```

### 预期结果
- 响应头应包含 `Content-Encoding: gzip`
- 数据大小应显著减少
- 前端应能正常接收和解压数据

## 性能优化建议

### 1. 数据分页
对于超大数据集，建议实现分页：

```typescript
@Get('data')
async getProjectDeviceData(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 100
) {
  // 实现分页逻辑
}
```

### 2. 字段筛选
允许前端指定需要的字段：

```typescript
@Get('data')
async getProjectDeviceData(
  @Query('fields') fields?: string
) {
  // 根据 fields 参数筛选返回字段
}
```

### 3. 缓存策略
对不常变化的数据添加缓存：

```typescript
@Get('data')
@UseInterceptors(CacheInterceptor)
@CacheTTL(300) // 缓存5分钟
async getProjectDeviceData() {
  // 实现缓存逻辑
}
```

## 监控和调试

### 日志监控
可以在日志中查看压缩相关信息：

```typescript
// 在控制器中添加日志
@Get('data')
async getProjectDeviceData(@Query() query: any) {
  const startTime = Date.now()
  const result = await this.service.getProjectDeviceData(query)
  const endTime = Date.now()
  
  console.log(`接口响应时间: ${endTime - startTime}ms`)
  console.log(`数据大小: ${JSON.stringify(result).length} 字符`)
  
  return result
}
```

### 性能指标
建议监控以下指标：
- 响应时间
- 压缩前后数据大小
- 压缩率
- 网络传输时间

## 故障排除

### 常见问题

1. **压缩未生效**
   - 检查响应数据是否超过 1KB 阈值
   - 确认客户端发送了 `Accept-Encoding` 头
   - 检查 Fastify 压缩插件是否正确注册

2. **前端无法解析数据**
   - 确认浏览器支持 Gzip 解压
   - 检查响应头中的 `Content-Encoding`
   - 验证数据格式是否正确

3. **性能问题**
   - 调整压缩级别（降低 level 值）
   - 考虑提高压缩阈值
   - 评估是否需要压缩

### 调试命令

```bash
# 检查压缩插件是否正确加载
curl -H "Accept-Encoding: gzip" -v http://localhost:3000/api/project-device/data

# 测试不同大小的数据
curl -H "Accept-Encoding: gzip" -d "large-data" http://localhost:3000/api/test

# 监控网络流量
tcpdump -i lo0 -s 0 -w capture.pcap port 3000
```

## 数据压缩和解压

### MongoDB 数据压缩
项目还实现了对 MongoDB 中存储数据的压缩功能：

```typescript
// 压缩数据
export async function compressData(data: any): Promise<Buffer> {
  const buffer = await gzipAsync(JSON.stringify(data));
  return buffer;
}

// 解压数据（支持 MongoDB Binary 类型）
export async function decompressData(buffer: Buffer | any): Promise<any> {
  // 处理 MongoDB Binary 类型
  let bufferData: Buffer;
  if (buffer && typeof buffer === 'object' && buffer.buffer) {
    // MongoDB Binary 类型，转换为 Buffer
    bufferData = Buffer.from(buffer.buffer);
  } else if (buffer instanceof Buffer) {
    // 已经是 Buffer 类型
    bufferData = buffer;
  } else {
    throw new Error('Invalid buffer type for decompression');
  }
  
  const decompressed = await gunzipAsync(bufferData);
  return JSON.parse(decompressed.toString());
}
```

### 使用场景
- 当用户数据超过 10MB 时自动压缩存储
- 读取时自动解压并返回原始数据
- 支持 MongoDB Binary 类型的正确处理

## 总结

Gzip 压缩功能已成功集成到项目中，包括：

1. **HTTP 响应压缩**: 使用 `@fastify/compress` 插件，自动压缩超过 1KB 的响应
2. **MongoDB 数据压缩**: 对大数据进行压缩存储，节省存储空间
3. **兼容性处理**: 正确处理 MongoDB Binary 类型的解压

这些功能能够显著减少网络传输时间和存储空间，提升系统性能。前端无需任何修改，浏览器会自动处理 HTTP 压缩和解压。 