import { env, envNumber } from '~/global/env'

export const mongDBRegToken = 'mongDB'

export const mongDBConfig = {
  type: 'mongodb',
  host: env('DB_MONGODB_URL', 'localhost'), // MongoDB 连接 URL
  port: envNumber('DB_MONGODB_PORT', 27017),
  database: env('DB_MONGODB_DATABASE'), // 数据库名称
}
