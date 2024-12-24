// db.ts
import mongoose from 'mongoose'
import { mongDBConfig } from '~/config/mongodb.config'

export async function connectDB(): Promise<void> {
  try {
    // 'mongodb://localhost:27017/your_database';
    const uri = `mongodb://${mongDBConfig.host}:${mongDBConfig.port}/${mongDBConfig.database}`
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully.')
  }
  catch (error) {
    console.error('MongoDB connection error:', (error as Error).message)
    throw new Error('Database connection failed')
  }
}

connectDB()
