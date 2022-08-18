import { Router } from 'express'
import {
  getFavorites,
  getProperty,
  getPropertyDetails,
  likeProperty,
  updateProperty,
  getPropertiesList,
  getVisitedProperties,
  getAllProperties,
  deleteProperty,
  validateProperty
} from './property.controllers'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { propertyValidation } from './property.validation'
import { checkSchema } from 'express-validator'
import {
  isSignedInMiddleware,
  hasRoleMiddleware
} from '../../utils/authorization'
import { Roles } from '../user/roles.enum'

const router = Router()

router.post(
  '/update',
  isSignedInMiddleware,
  checkSchema(propertyValidation.updateSchema),
  returnIfNotValid,
  resolvePromises,
  updateProperty
)

router.post(
  '/get',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getProperty
)

router.post(
  '/getdetails',
  isSignedInMiddleware,
  checkSchema(propertyValidation.getPublicSchema),
  returnIfNotValid,
  resolvePromises,
  getPropertyDetails
)

router.get(
  '/getPropertiesList',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getPropertiesList
)

router.post(
  '/like',
  isSignedInMiddleware,
  checkSchema(propertyValidation.likePropertySchema),
  returnIfNotValid,
  resolvePromises,
  likeProperty
)

router.get(
  '/getfavorites',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getFavorites
)

router.get(
  '/getVisitedProperties',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getVisitedProperties
)

router.get(
  '/getAllProperties',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getAllProperties
)

router.post(
  '/delete',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  deleteProperty
)

router.post(
  '/validate',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  validateProperty
)

export default router
