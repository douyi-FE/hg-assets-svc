import mongoose, { Document, Schema } from 'mongoose'

export interface IProjectDevice extends Document {
  templateId: string
  projectData: any
  userId: string
  type: string
  project: string
  device: string
  engineerId: string
  engineer: string
  updateTime: Date
  createTime: Date
}

const projectDeviceSchema: Schema = new Schema({
  templateId: { type: String, required: true },
  projectData: { type: Object, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  project: { type: String, required: true },
  device: { type: String, required: true },
  engineerId: { type: String, required: true },
  engineer: { type: String, required: true },
  updateTime: { type: Date, required: true },
  createTime: { type: Date, required: true },
}, { timestamps: true })

const ProjectDeviceCollect = mongoose.model<IProjectDevice>('ProjectDevice', projectDeviceSchema, 'project_device')

export default ProjectDeviceCollect
