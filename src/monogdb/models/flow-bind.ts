import mongoose, { Document, Schema } from 'mongoose'

export interface IFlowBind extends Document {
  flowId: string
  flowName: string
  module: string
}

const flowBindSchema = new Schema({
  flowId: { type: String, required: true },
  flowName: { type: String, required: true },
  module: { type: String, required: true },
}, { timestamps: true })

const FlowBindCollect = mongoose.model<IFlowBind>('FlowBind', flowBindSchema, 'flow-bind')

export default FlowBindCollect
