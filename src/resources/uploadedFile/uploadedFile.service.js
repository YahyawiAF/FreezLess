import { UploadedFile } from './uploadedFile.model'

export const updateUploadedFile = (fileId, info) => {
  UploadedFile.findById(fileId, (err, uploadedFile) => {
    uploadedFile.fileName = info.fileName
    uploadedFile.user = info.user
    uploadedFile.property = info.property
  })
}
