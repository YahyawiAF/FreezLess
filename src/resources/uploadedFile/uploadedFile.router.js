import {hasRoleMiddleware, isSignedInMiddleware} from '../../utils/authorization'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import {
  downloadFile,
  getAllFiles,
  getFile,
  getFilesToValidate,
  uploadFile,
  validate
} from './uploadedFile.controllers'
import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { uploadedFileValidation } from './uploadedFile.validation'
import { Roles } from '../user/roles.enum'

const router = Router()

router.post(
  '/upload',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  uploadFile
)

router.post(
  '/getFile',
  isSignedInMiddleware,
  checkSchema(uploadedFileValidation.getFileSchema),
  returnIfNotValid,
  resolvePromises,
  getFile
)

router.post(
  '/getAllFiles',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getAllFiles
)

router.post(
  '/getFilesToValidate',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getFilesToValidate
)

router.post(
  '/validate',
  hasRoleMiddleware(Roles.Admin),
  checkSchema(uploadedFileValidation.validateUploadedFileSchema),
  returnIfNotValid,
  resolvePromises,
  validate
)

router.get(
  '/download/:id/:fileName',
  returnIfNotValid,
  resolvePromises,
  downloadFile
)

export default router
