// models/Users.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IBuiltInEjs extends Document {
  name: string
  sjs?: string
}

const builtInEjsSchema: Schema = new Schema({
  name: { type: String, required: true },
  sjs: { type: String }, // 允许其他字段
}, { timestamps: true })

const UsersCollect = mongoose.model<IBuiltInEjs>('Built_in_ejs', builtInEjsSchema, 'built_in_ejs')

export default UsersCollect
