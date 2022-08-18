import jwt from 'jsonwebtoken'
import config from '../config'
import { User } from '../resources/user/user.model'
import { ResponseCodes } from './responseCodes'

export const token = (req, res, next) => {
  let token = req.headers['x-access-token']
  if (!token) {
    next()
  } else {
    jwt.verify(token, config.secrets.jwt, async function(err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          responseCode: ResponseCodes.invalid_jwt_token
        })
      }
      // if everything good, save to request for use in other routes
      req.user = await User.findById(decoded.user._id).populate(
        'properties propertyPreference profilePicture identityDocument civilStatus separationPlan'
      )
      next()
    })
  }
}

export const hasRoleMiddleware = role => {
  return (
    hasRoleMiddleware[role] ||
    (hasRoleMiddleware[role] = function(req, res, next) {
      if (!hasRole(req.user, role)) {
        return res.status(403).json({
          status: false,
          responseCode: ResponseCodes.unauthorized
        })
      } else next()
    })
  )
}

export const isVisitorMiddleware = (req, res, next) => {
  if (req.user == null) {
    next()
  } else {
    return res.status(403).json({
      status: false,
      responseCode: ResponseCodes.unauthorized
    })
  }
}

export const isSignedInMiddleware = (req, res, next) => {
  if (req.user != null) {
    next()
  } else {
    return res.status(403).json({
      status: false,
      responseCode: ResponseCodes.unauthorized
    })
  }
}

export const hasRole = (user, role) => {
  return user !== null && user.roles.indexOf(role) > -1
}
