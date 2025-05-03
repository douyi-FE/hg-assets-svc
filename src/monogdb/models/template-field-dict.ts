import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateFieldDict extends Document {
  templateId: string
  applicationData: any
  userId: string
  deptId: number
  updateTime: Date
}

const templateFieldDictSchema: Schema = new Schema({
  templateId: { type: String, required: true },
  applicationData: { type: Object, required: true },
  userId: { type: String, required: true },
  deptId: { type: Number, required: false },
  updateTime: { type: Date, required: true },
}, { timestamps: true })

const TemplateFieldDictCollect = mongoose.model<ITemplateFieldDict>('TemplateFieldDict', templateFieldDictSchema, 'template_field_dict')

export default TemplateFieldDictCollect
