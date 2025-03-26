import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateData extends Document {
  applicationName: string
  templateId: string
  templateName: string
}

const templateDataSchema: Schema = new Schema({
  applicationName: { type: String, required: true },
  templateId: { type: String, required: true },
  templateName: { type: String, required: true },
}, { timestamps: true })

const templateDataCollect = mongoose.model<ITemplateData>('TemplateData', templateDataSchema, 'template_data')

export default templateDataCollect
