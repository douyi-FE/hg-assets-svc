import mongoose, { Document, Schema } from 'mongoose'

export interface IEngineer extends Document {
  name: string
  code: string
  project_code: string
  device_code: string
  device_id: string
}

const engineerSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  device_code: { type: String, required: true },
  device_id: { type: String, required: true },
  project_code: { type: String, required: true },
}, { timestamps: true })

const EngineerCollect = mongoose.model<IEngineer>('engineer', engineerSchema, 'engineer')

export default EngineerCollect
