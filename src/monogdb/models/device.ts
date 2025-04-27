import mongoose, { Document, Schema } from 'mongoose'

export interface IDevice extends Document {
  name: string
  code: string
  project_code: string
}

const deviceSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  project_code: { type: String, required: true },
}, { timestamps: true })

const DeviceCollect = mongoose.model<IDevice>('device', deviceSchema, 'device')

export default DeviceCollect
