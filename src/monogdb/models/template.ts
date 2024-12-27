// models/Template.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplate extends Document {
  name: string
  code: string
  note: string
  status: number
  isBuildIn: boolean
  file: string
}

const templateSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  note: { type: String },
  isBuildIn: { type: Boolean, required: true },
  status: { type: Number, min: 0 },
  file: { type: String },
}, { timestamps: true })

const TemplateCollect = mongoose.model<ITemplate>('Template', templateSchema, 'template')

export default TemplateCollect
