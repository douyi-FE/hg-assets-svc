import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateData extends Document {
  name: string
  code: string
  record: Map<string, any>
}

const templateDataSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  record: { type: Map }, // 允许其他字段
}, { timestamps: true })

const templateDataCollect = mongoose.model<ITemplateData>('TemplateData', templateDataSchema, 'template_data')

export default templateDataCollect
