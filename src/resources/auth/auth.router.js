import { Router } from 'express'
import {
  resetPassword,
  generateResetPasswordToken,
  signIn,
  signUp,
  updatePassword,
  confirmEmail,
  resendEmailVerificationToken
} from './auth.controllers'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { authValidation } from './auth.validation'
import { checkSchema } from 'express-validator'
import {isSignedInMiddleware, isVisitorMiddleware} from '../../utils/authorization'

const router = Router()

router.post(
  '/signup',
  isVisitorMiddleware,
  checkSchema(authValidation.signUpSchema),
  returnIfNotValid,
  resolvePromises,
  signUp
)
router.post(
  '/signin',
  isVisitorMiddleware,
  checkSchema(authValidation.signInSchema),
  returnIfNotValid,
  resolvePromises,
  signIn
)
router.post(
  '/resendemailverificationtoken',
  isVisitorMiddleware,
  checkSchema(authValidation.sendResetEmailSchema),
  returnIfNotValid,
  resolvePromises,
  resendEmailVerificationToken
)
router.post(
  '/confirmemail',
  isVisitorMiddleware,
  checkSchema(authValidation.confirmEmailSchema),
  returnIfNotValid,
  resolvePromises,
  confirmEmail
)
router.post(
  '/sendresetemail',
  isVisitorMiddleware,
  checkSchema(authValidation.sendResetEmailSchema),
  returnIfNotValid,
  resolvePromises,
  generateResetPasswordToken
)
router.post(
  '/resetpassword',
  isVisitorMiddleware,
  checkSchema(authValidation.resetPasswordSchema),
  returnIfNotValid,
  resolvePromises,
  resetPassword
)
router.post(
  '/updatepassword',
  isSignedInMiddleware,
  checkSchema(authValidation.updatePasswordSchema),
  returnIfNotValid,
  resolvePromises,
  updatePassword
)

export default router
