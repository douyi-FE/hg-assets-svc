import { ConfigType, registerAs } from '@nestjs/config'

import dotenv from 'dotenv'

import { DataSource, DataSourceOptions } from 'typeorm'

import { env, envBoolean, envNumber } from '~/global/env'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// 当前通过 npm scripts 执行的命令
const currentScript = process.env.npm_lifecycle_event

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', 3306),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE', false),
  // 解决通过 pnpm migration:run 初始化数据时，遇到的 SET FOREIGN_KEY_CHECKS = 0; 等语句报错问题, 仅在执行数据迁移操作时设为 true
  multipleStatements: currentScript === 'typeorm',
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
  // 添加连接超时相关配置
  connectTimeout: 60000, // 连接超时时间，单位毫秒
  // acquireTimeout: 60000, // 获取连接超时时间，单位毫秒
  extra: {
    connectionLimit: 10, // 连接池大小
    waitForConnections: true, // 当无连接可用时等待
    queueLimit: 0, // 队列大小限制，0表示不限制
  },
}
export const dbRegToken = 'database'

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
)

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
