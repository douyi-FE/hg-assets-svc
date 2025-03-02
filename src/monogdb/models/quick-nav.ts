import mongoose, { Document, Schema } from 'mongoose'

export interface IQuickNav extends Document {
  quickNavIdList: any[]
}

const quickNavSchema: Schema = new Schema({
  quickNavIdList: { type: Array, required: true },
}, { timestamps: true })

const QuickNavCollect = mongoose.model<IQuickNav>('QuickNav', quickNavSchema, 'quick-nav')

export default QuickNavCollect
