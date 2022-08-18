import { Router } from 'express'
import { getAll, add, deleteSelectsLists } from './selectsLists.controllers'
import { hasRoleMiddleware } from '../../utils/authorization'
import { Roles } from '../user/roles.enum'
import { resolvePromises, returnIfNotValid } from '../../utils/validation'
import { checkSchema } from 'express-validator'
import { selectsListsValidation } from './selectsLists.validation'

const router = Router()

router.get('/getall', returnIfNotValid, resolvePromises, getAll)

router.post(
  '/add',
  hasRoleMiddleware(Roles.Admin),
  checkSchema(selectsListsValidation.addSchema),
  returnIfNotValid,
  resolvePromises,
  add
)

router.post(
  '/deleteSelectsLists',
  hasRoleMiddleware(Roles.Admin),
  returnIfNotValid,
  resolvePromises,
  deleteSelectsLists
)

export default router
