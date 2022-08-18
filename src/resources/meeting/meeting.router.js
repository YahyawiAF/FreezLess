import { Router } from 'express'
import {
  getAllMeetings,
  getAvailabilities,
  getPropertyMeetings,
  makeOffer,
  proposeMeeting,
  respondAfterMeeting,
  respondMeeting,
  respondToOffer,
  deleteMeeting
} from './meeting.controllers'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { meetingValidation } from './meeting.validation'
import { checkSchema } from 'express-validator'
import {
  hasRoleMiddleware,
  isSignedInMiddleware
} from '../../utils/authorization'
import { Roles } from '../user/roles.enum'

const router = Router()

router.post(
  '/getPropertyMeetings',
  isSignedInMiddleware,
  checkSchema(meetingValidation.getPropertyMeetingsSchema),
  returnIfNotValid,
  resolvePromises,
  getPropertyMeetings
)

router.post(
  '/availabilities',
  isSignedInMiddleware,
  checkSchema(meetingValidation.availabilitiesSchema),
  returnIfNotValid,
  resolvePromises,
  getAvailabilities
)

router.post(
  '/propose',
  isSignedInMiddleware,
  checkSchema(meetingValidation.proposeSchema),
  returnIfNotValid,
  resolvePromises,
  proposeMeeting
)

router.post(
  '/respond',
  isSignedInMiddleware,
  checkSchema(meetingValidation.respondSchema),
  returnIfNotValid,
  resolvePromises,
  respondMeeting
)

router.get(
  '/getAllMeetings',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  getAllMeetings
)

router.post(
  '/respondAfterMeeting',
  isSignedInMiddleware,
  checkSchema(meetingValidation.respondAfterMeetingSchema),
  returnIfNotValid,
  resolvePromises,
  respondAfterMeeting
)

router.post(
  '/makeOffer',
  isSignedInMiddleware,
  checkSchema(meetingValidation.makeOfferSchema),
  returnIfNotValid,
  resolvePromises,
  makeOffer
)

router.post(
  '/respondToOffer',
  isSignedInMiddleware,
  checkSchema(meetingValidation.respondToOfferSchema),
  returnIfNotValid,
  resolvePromises,
  respondToOffer
)

router.post(
  '/deleteMeeting',
  isSignedInMiddleware,
  checkSchema(meetingValidation.deleteSchema),
  returnIfNotValid,
  resolvePromises,
  deleteMeeting
)
export default router
