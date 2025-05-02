import { env, envNumber } from '~/global/env'

export const mongDBRegToken = 'mongDB'

// 加入用户名密码认证信息
export const mongDBConfig = {
  type: 'mongodb',
  host: env('DB_MONGODB_URL', '127.0.0.1'), // MongoDB 连接 URL
  port: envNumber('DB_MONGODB_PORT', 27017),
  database: env('DB_MONGODB_DATABASE'), // 数据库名称
  username: env('DB_MONGODB_USERNAME'), // 用户名
  password: env('DB_MONGODB_PASSWORD'), // 密码
}
// mongodb://root:26jkue3N5QxcFyw2ysyX@113.44.53.177:27017/nest_admin
