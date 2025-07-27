import mongoose, { Document, Schema } from 'mongoose'

export interface IApplicationDataHistory extends Document {
  tableName: string
  tableKey: string
  name: string
  mark: string
  applicationData: any
  ejs: string
  userId: string
}

const applicationDataHistorySchema: Schema = new Schema({
  tableName: { type: String, required: true },
  tableKey: { type: String, required: true },
  name: { type: String, required: true },
  mark: { type: String, required: false },
  applicationData: { type: Object, required: true },
  ejs: { type: String, required: false },
  userId: { type: String, required: true },
}, { timestamps: true })

const ApplicationDataHistoryCollect = mongoose.model<IApplicationDataHistory>('ApplicationDataHistory', applicationDataHistorySchema, 'application_data_history')

export default ApplicationDataHistoryCollect
