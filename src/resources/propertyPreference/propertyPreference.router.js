import { Router } from 'express'
import {
  getPropertyPreference,
  updatePropertyPreference
} from './propertyPreference.controllers'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { propertyPreferenceValidation } from './propertyPreference.validation'
import { checkSchema } from 'express-validator'
import {isSignedInMiddleware} from '../../utils/authorization'

const router = Router()

router.post(
  '/update',
  isSignedInMiddleware,
  checkSchema(propertyPreferenceValidation.updateSchema),
  returnIfNotValid,
  resolvePromises,
  updatePropertyPreference
)

router.get(
  '/get',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getPropertyPreference
)

export default router
