import mongoose, { Document, Schema } from 'mongoose'

export interface IFlowExecute extends Document {
  initiatorId: string
  flowDesignId: string
  businessId: string
  processDefinitionId: string
  status: string
  stateSnapshot: object
  parentInstanceId: string
  metadata: object
}

const flowExecuteSchema: Schema = new Schema({
  initiatorId: { type: String, required: true },
  flowDesignId: { type: String, required: true },
  businessId: { type: String, required: true, unique: true },
  processDefinitionId: { type: String, required: true },
  status: { type: String, required: true },
  stateSnapshot: { type: Object, required: true },
  parentInstanceId: { type: String, required: false },
  metadata: { type: Object, required: false },
}, { timestamps: true })

const FlowExecuteCollect = mongoose.model<IFlowExecute>('flowExecute', flowExecuteSchema, 'flow-execute')

export default FlowExecuteCollect
