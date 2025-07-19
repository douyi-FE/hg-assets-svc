import FastifyCookie from '@fastify/cookie'
import FastifyMultipart from '@fastify/multipart'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import fastifyCompress from '@fastify/compress'

const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
  // 增加请求体大小限制到200MB
  bodyLimit: 200 * 1024 * 1024, // 200MB
  // 增加请求超时时间
  connectionTimeout: 300000, // 5分钟
  keepAliveTimeout: 300000, // 5分钟
})
export { app as fastifyApp }

// 注册压缩插件
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

app.register(FastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 200 * 1024 * 1024, // limit size 200M
    files: 5, // Max number of file fields
  },
})

app.register(FastifyCookie, {
  secret: 'cookie-secret', // 这个 secret 不太重要，不存鉴权相关，无关紧要
})

app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const { origin } = request.headers
  if (!origin)
    request.headers.origin = request.headers.host

  // forbidden php

  const { url } = request

  if (url.endsWith('.php')) {
    reply.raw.statusMessage
      = 'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.'

    return reply.code(418).send()
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
    return reply.code(204).send()

  done()
})
