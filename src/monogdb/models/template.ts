// models/Template.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplate extends Document {
  name: string
  code: string
  flowPath: string
  note: string
  status: number
  isBuildIn: boolean
  initDataSource: any
  file: string
}

const templateSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  flowPath: { type: String },
  note: { type: String },
  isBuildIn: { type: Boolean, required: true },
  status: { type: Number, min: 0 },
  initDataSource: { type: Object },
  file: { type: String },
}, { timestamps: true })

const TemplateCollect = mongoose.model<ITemplate>('Template', templateSchema, 'template')

export default TemplateCollect
