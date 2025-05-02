import mongoose, { Schema, Document, Types } from 'mongoose'
import { GridFSBucket } from 'mongodb'

// Interface for Export metadata
export interface IExport extends Document {
  userId: Types.ObjectId
  snippetId: Types.ObjectId | null
  fileId: Types.ObjectId
  format: string
  createdAt: Date
}

// Schema for Export metadata
const ExportSchema = new Schema<IExport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  snippetId: {
    type: Schema.Types.ObjectId,
    ref: 'Snippet',
    required: false,
    default: null,
  },
  fileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  format: {
    type: String,
    enum: ['png'],
    default: 'png',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for faster queries
ExportSchema.index({ userId: 1, snippetId: 1 })
ExportSchema.index({ createdAt: 1 })

// Helper function to get GridFS bucket
export const getGridFSBucket = (): GridFSBucket => {
  return new GridFSBucket(mongoose.connection.db as any, {
    bucketName: 'exports',
  })
}

const Export = mongoose.model<IExport>('Export', ExportSchema)
export default Export
