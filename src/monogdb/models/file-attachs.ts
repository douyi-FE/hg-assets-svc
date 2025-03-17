// models/Template.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IFileAttachs extends Document {
  fileId: string
  originalFileName: string
  fileName: string
  fileContent: string
  fileExtension: string
  fileTime: number
  fileSize: number
}

const fileAttachsSchema: Schema = new Schema({
  fileId: { type: String, required: true },
  originalFileName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileContent: { type: String, required: true },
  fileExtension: { type: String, required: true },
  fileTime: { type: Number, required: false },
  fileSize: { type: Number, required: false },
}, { timestamps: true })

const fileAttachsCollect = mongoose.model<IFileAttachs>('FileAttachs', fileAttachsSchema, 'file_attachs')

export default fileAttachsCollect
