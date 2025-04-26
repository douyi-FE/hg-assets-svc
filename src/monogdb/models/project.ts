import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  project_name: string
  project_code: string
  contract_amount: number
  contract_name: string
  contract_party_a: string
  contract_party_b: string
  sign_date: string
}

const projectSchema: Schema = new Schema({
  project_name: { type: String, required: true },
  project_code: { type: String, required: true },
  contract_amount: { type: Number, required: false },
  contract_name: { type: String, required: true },
  contract_party_a: { type: String, required: false },
  contract_party_b: { type: String, required: false },
  sign_date: { type: String, required: false },

}, { timestamps: true })

const ProjectCollect = mongoose.model<IProject>('project', projectSchema, 'project')

export default ProjectCollect
