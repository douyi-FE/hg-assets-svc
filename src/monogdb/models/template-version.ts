// models/TemplateVersion.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateVersion extends Document {
  version: string
  templateId: string
  note: string
  status: number
  file: string
  type: string
}

const templateVersionSchema: Schema = new Schema({
  version: { type: String, required: true },
  templateId: { type: String, required: true },
  note: { type: String },
  status: { type: Number, min: 0 },
  file: { type: String },
  type: { type: String },
}, { timestamps: true })

const TemplateVersionCollect = mongoose.model<ITemplateVersion>('TemplateVersion', templateVersionSchema, 'template-version')

export default TemplateVersionCollect
