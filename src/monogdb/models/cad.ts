import mongoose, { Document, Schema } from 'mongoose'

export interface ICad extends Document {
  name: string
  cadPath: string
  ejs: string
  links: any[]
}

const cadSchema = new Schema({
  name: { type: String, required: true },
  cadPath: { type: String, required: false },
  ejs: { type: String, required: false },
  links: { type: [Schema.Types.Mixed], require: false, default: [] },
}, {
  timestamps: true,
  toObject: { getters: true }, // 启用读取转换
  toJSON: { getters: true }, // 确保JSON输出也应用getter
})

const CadCollect = mongoose.model<ICad>('Cad', cadSchema, 'cad')

export default CadCollect
