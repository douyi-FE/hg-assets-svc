import mongoose, { Document, Schema } from 'mongoose'

export interface ILeave extends Document {
  applyCode: string
  employeeId: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  attachments: any[]
  approverStatus: string
}

const leaveSchema = new Schema({
  applyCode: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  attachments: { type: Array, required: true },
  approverStatus: { type: String, required: true },
}, { timestamps: true })

const LeaveCollect = mongoose.model<ILeave>('Leave', leaveSchema, 'leave')

export default LeaveCollect
