import mongoose, { Document, Schema } from 'mongoose'

export interface IFlowDesign extends Document {
  name: string
  note: string
  xml: string
}

const flowDesignSchema: Schema = new Schema({
  name: { type: String, required: true },
  note: { type: String },
  xml: { type: String },
}, { timestamps: true })

const FlowDesignCollect = mongoose.model<IFlowDesign>('flowDesign', flowDesignSchema, 'flow-design')

export default FlowDesignCollect
