import { Router } from 'express'
import {
  getCalendar,
  updateAvailabilities,
  updateUser,
  setFcmToken,
  testNotifications,
  getNotifications,
  getAllUsers,
  getUserByID,
  getConnectedUser,
  getUserProfileById
} from './user.controllers'
import {
  hasRoleMiddleware,
  isSignedInMiddleware
} from '../../utils/authorization'
import { checkSchema } from 'express-validator'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { userValidation } from './user.validation'
import { Roles } from './roles.enum'

const router = Router()

router.post(
  '/getConnectedUser',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getConnectedUser
)
router.post(
  '/getUserProfile',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getUserProfileById
)

router.post(
  '/update',
  isSignedInMiddleware,
  checkSchema(userValidation.updateSchema),
  returnIfNotValid,
  resolvePromises,
  updateUser
)

router.post(
  '/availabilities/update',
  isSignedInMiddleware,
  checkSchema(userValidation.updateAvailabilitiesSchema),
  returnIfNotValid,
  resolvePromises,
  updateAvailabilities
)

router.get(
  '/calendar',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getCalendar
)

router.post(
  '/setFcmToken',
  isSignedInMiddleware,
  checkSchema(userValidation.setFcmTokenSchema),
  returnIfNotValid,
  resolvePromises,
  setFcmToken
)

router.post(
  '/testNotifications',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  testNotifications
)

router.get(
  '/getNotifications',
  isSignedInMiddleware,
  returnIfNotValid,
  resolvePromises,
  getNotifications
)

router.get(
  '/getAllUsers',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getAllUsers
)

router.post(
  '/getOneUser',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getUserByID
)

export default router
