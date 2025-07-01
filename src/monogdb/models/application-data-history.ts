import mongoose, { Document, Schema } from 'mongoose'

export interface IApplicationDataHistory extends Document {
  applicationId: string
  name: string
  mark: string
  applicationData: any
  userId: string
}

const applicationDataHistorySchema: Schema = new Schema({
  applicationId: { type: String, required: true },
  name: { type: String, required: true },
  mark: { type: String, required: false },
  applicationData: { type: Object, required: true },
  userId: { type: String, required: true },
}, { timestamps: true })

const ApplicationDataHistoryCollect = mongoose.model<IApplicationDataHistory>('ApplicationDataHistory', applicationDataHistorySchema, 'application_data_history')

export default ApplicationDataHistoryCollect
