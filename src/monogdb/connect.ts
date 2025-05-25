// db.ts
import mongoose from 'mongoose'
import { mongDBConfig } from '~/config/mongodb.config'

export async function connectDB(): Promise<void> {
  try {
    // 'mongodb://root:26jkue3N5QxcFyw2ysyX@113.44.53.177:27017/nest_admin?authSource=admin';
    // 加入用户名密码认证信息
    let uri = ''
    if (mongDBConfig.username && mongDBConfig.password) {
      uri = `mongodb://${mongDBConfig.username}:${mongDBConfig.password}@${mongDBConfig.host}:${mongDBConfig.port}/${mongDBConfig.database}?authSource=admin`
    }
    else {
      uri = `mongodb://${mongDBConfig.host}:${mongDBConfig.port}/${mongDBConfig.database}`
    }
    // const uri = `mongodb://${mongDBConfig.host}:${mongDBConfig.port}/${mongDBConfig.database}`
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully.')
  }
  catch (error) {
    console.error('MongoDB connection error:', (error as Error).message)
    throw new Error('Database connection failed')
  }
}

connectDB()
