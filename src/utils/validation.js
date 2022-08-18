import { ResponseCodes } from './responseCodes'
import { User } from '../resources/user/user.model'
import moment from '../utils/moment'
const { validationResult } = require('express-validator')

export const resolvePromises = (req, res, next) => {
  let promises = []
  for (let p in req.body) {
    if (
      req.body &&
      req.body.hasOwnProperty(p) &&
      req.body[p] instanceof Promise
    ) {
      promises.push(req.body[p])
    }
  }
  Promise.all(promises)
    .then(result => {
      let i = 0
      for (let k in req.body) {
        if (req.body.hasOwnProperty(k) && req.body[k] instanceof Promise) {
          req.body[k] = result[i]
          i++
        }
      }

      next()
    })
    .catch(err => {
      return next(err)
    })
}

export const returnIfNotValid = (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      responseCode: ResponseCodes.validation_error,
      validationErrors: errors.array()
    })
  }
  next()
}

const regex = {
  email: /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/,
  password: /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/,
  phone: /^[1-9](\d{8})$/,
  lettersNumbersAndUnderline: /(^[a-z0-9_]+$)/
}

export const schema = {
  required: {
    exists: {
      errorMessage: 'required'
    }
  },
  email: {
    matches: {
      options: regex.email,
      errorMessage: 'emailPattern'
    }
  },
  emailExist: {
    custom: {
      options: value => {
        return User.find({ email: value }).then(user => {
          if (user.length !== 0) {
            return Promise.reject(new Error())
          }
        })
      },
      errorMessage: 'emailExist'
    }
  },
  password: {
    matches: {
      options: regex.password,
      errorMessage: 'passwordPattern'
    }
  },
  token: {
    isLength: {
      options: { min: 40, max: 40 }
    },
    errorMessage: 'wrongToken'
  },
  newPassword: {
    custom: {
      options: (value, { req }) => {
        return value !== req.body.password
      }
    },
    errorMessage: 'newPasswordIsSameAsOld'
  },
  phone: {
    matches: {
      options: regex.phone,
      errorMessage: 'phonePattern'
    }
  },
  isInt: {
    isInt: true,
    errorMessage: 'invalidInt'
  },
  isNumeric: {
    isNumeric: true,
    errorMessage: 'invalidNumeric'
  },
  isBoolean: {
    isBoolean: true,
    errorMessage: 'invalidBoolean'
  },
  isDate: {
    custom: {
      options: (value, { req }) => {
        return moment(value, moment.ISO_8601, true).isValid()
      }
    },
    errorMessage: 'invalidDate'
  },
  toDate: {
    customSanitizer: {
      options: (value, { req, location, path }) => {
        return value !== null ? moment(value) : null
      }
    }
  },
  isOptional: {
    optional: { options: { nullable: true } }
  },
  isMongoId: {
    isMongoId: true,
    errorMessage: 'invalidId'
  },
  isArray: {
    custom: {
      options: (value, { req }) => {
        return Array.isArray(value)
      }
    },
    errorMessage: 'invalidArray'
  },
  isLettersNumbersAndUnderline: {
    matches: {
      options: regex.lettersNumbersAndUnderline,
      errorMessage: 'invalidPattern'
    }
  }
}
