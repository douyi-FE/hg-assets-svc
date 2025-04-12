import mongoose, { Document, Schema } from 'mongoose'

export interface IApplicationData extends Document {
  templateId: string
  applicationData: any
  userId: string
  deptId: number
  updateTime: Date
}

const applicationDataSchema: Schema = new Schema({
  templateId: { type: String, required: true },
  applicationData: { type: Object, required: true },
  userId: { type: String, required: true },
  deptId: { type: Number, required: false },
  updateTime: { type: Date, required: true },
}, { timestamps: true })

const ApplicationDataCollect = mongoose.model<IApplicationData>('ApplicationData', applicationDataSchema, 'application_data')

export default ApplicationDataCollect
