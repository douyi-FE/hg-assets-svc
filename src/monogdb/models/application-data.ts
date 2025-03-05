import mongoose, { Document, Schema } from 'mongoose'

export interface IApplicationData extends Document {
  templateId: string
  applicationData: any
  userId: string
  updateTime: Date
}

const applicationDataSchema: Schema = new Schema({
  templateId: { type: String, required: true },
  applicationData: { type: Object, required: true },
  userId: { type: String, required: true },
  updateTime: { type: Date, required: true },
}, { timestamps: true })

const ApplicationDataCollect = mongoose.model<IApplicationData>('ApplicationData', applicationDataSchema, 'application_data')

export default ApplicationDataCollect
