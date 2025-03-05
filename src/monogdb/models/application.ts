import mongoose, { Document, Schema } from 'mongoose'

export interface IApplication extends Document {
  templateId: string
  isBuildIn: boolean
  content: string
  name: string
  icon: string
  description: string
}

const applicationSchema: Schema = new Schema({
  templateId: { type: String, required: true },
  isBuildIn: { type: Boolean, required: true },
  content: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, required: false },
  description: { type: String, required: false },
}, { timestamps: true })

const ApplicationCollect = mongoose.model<IApplication>('Application', applicationSchema, 'application')

export default ApplicationCollect
