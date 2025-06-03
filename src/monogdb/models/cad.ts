import mongoose, { Document, Schema } from 'mongoose'

export interface ICad extends Document {
  name: string
  cadPath: string
  ejs: string
}

const cadSchema = new Schema({
  name: { type: String, required: true },
  cadPath: { type: String, required: false },
  ejs: { type: String, required: false },
}, { timestamps: true })

const CadCollect = mongoose.model<ICad>('Cad', cadSchema, 'cad')

export default CadCollect
