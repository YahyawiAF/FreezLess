import mongoose from 'mongoose'
import moment from '../../utils/moment'
let ObjectId = mongoose.Schema.Types.ObjectId

const uploadedFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String
    },
    originalName: {
      type: String
    },
    fileExtension: {
      type: String
    },
    fileSize: {
      type: Number
    },
    validated: {
      type: Boolean,
      default: false
    },
    refused: {
      type: Boolean,
      default: false
    },
    documentType: {
      type: Boolean,
      default: false
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    property: {
      type: ObjectId,
      ref: 'Property'
    },
    meeting: {
      type: ObjectId,
      ref: 'Meeting'
    },
    createdAt: {
      type: Date,
      default: moment
    },
    updatedAt: {
      type: Date,
      default: moment
    }
  },
  {}
)

uploadedFileSchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

uploadedFileSchema.methods.toJSON = function() {
  let obj = this.toObject()
  return obj
}

export const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema)
