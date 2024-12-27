// models/builtin.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IBuiltInEjs extends Document {
  name: string
  sjs?: string
}

const builtInEjsSchema: Schema = new Schema({
  name: { type: String, required: true },
  sjs: { type: String }, // 允许其他字段
}, { timestamps: true })

const builInCollect = mongoose.model<IBuiltInEjs>('BuiltInEjs', builtInEjsSchema, 'built_in_ejs')

export default builInCollect
