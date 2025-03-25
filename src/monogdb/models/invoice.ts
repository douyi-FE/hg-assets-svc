import mongoose, { Document, Schema } from 'mongoose'

export interface IInvoice extends Document {
  applyCode: string
  uid: string
  data: any
  status: 'draft' | 'pending' | 'approved'
  processId: string
  taskId: string
}

const invoiceSchema: Schema = new Schema({
  applyCode: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'pending', 'approved'],
  },
  processId: {
    type: String,
    required: false,
  },
  taskId: {
    type: String,
    required: false,
  },
}, { timestamps: true })

const InvoiceCollect = mongoose.model<IInvoice>('Invoice', invoiceSchema, 'invoice')

export default InvoiceCollect
