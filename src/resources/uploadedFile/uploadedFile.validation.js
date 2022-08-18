import { schema } from '../../utils/validation'
import { UploadedFile } from './uploadedFile.model'

export const uploadedFileIdSchema = {
  custom: {
    options: value => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (!uploadedFile) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'nonExistentUploadedFile'
  }
}

export const uploadedFileSanitizerSchema = {
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return UploadedFile.findById(value)
        .populate('user property meeting')
        .then(uploadedFile => {
          if (uploadedFile) {
            return Promise.resolve(uploadedFile)
          }
        })
    }
  }
}

const statusSchema = {
  isIn: {
    options: [['valid', 'refuse']]
  },
  errorMessage: 'invalidStatus'
}

export const uploadedFileValidation = {
  getFileSchema: {
    uploadedFile: { ...schema.required, ...schema.isMongoId }
  },
  validateUploadedFileSchema: {
    uploadedFile: {
      ...schema.isMongoId,
      ...uploadedFileIdSchema,
      ...uploadedFileSanitizerSchema
    },
    status: { ...statusSchema }
  }
}
