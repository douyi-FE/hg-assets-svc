import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateWord extends Document {
  name: string
  code: string
  note: string
  status: number
  isBuildIn: boolean
  file: string
  fileName: string
}

const templateWordSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  note: { type: String },
  isBuildIn: { type: Boolean, required: true },
  status: { type: Number, min: 0 },
  file: { type: String },
  fileName: { type: String },
}, { timestamps: true })

const TemplateWordCollect = mongoose.model<ITemplateWord>('templateWord', templateWordSchema, 'template-word')

export default TemplateWordCollect
