import { hashPassword, User } from '../user/user.model'
import jwt from 'jsonwebtoken'
import config from '../../config'
import moment from '../../utils/moment'
import { ResponseCodes } from '../../utils/responseCodes'
import { sendEmail } from '../email/sendEmail.service'
import { emailType } from '../email/emailType'
import { Roles } from '../user/roles.enum'
import { addNotification } from '../user/user.service'

export const signUp = (req, res, next) => {
  let newUser = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
  newUser.addRole(Roles.Buyer)
  if (req.body.role === Roles.Seller) {
    newUser.addRole(Roles.Seller)
  }
  hashPassword(newUser.password)
    .then(hash => {
      newUser.password = hash
      newUser.save((err, user) => {
        if (err) return next(err)
        sendEmailConfirmationEmail(user)
          .then(() => {
            return res.status(201).json({
              success: true,
              responseCode: ResponseCodes.user_created
            })
          })
          .catch(err => {
            return next(err)
          })
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const resendEmailVerificationToken = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      return res.status(404).json({
        success: false,
        responseCode: ResponseCodes.no_user_found
      })
    }
    sendEmailConfirmationEmail(user)
      .then(() => {
        return res.status(200).json({
          success: true,
          responseCode: ResponseCodes.email_sent
        })
      })
      .catch(err => {
        return next(err)
      })
  })
}

const sendEmailConfirmationEmail = user => {
  return user
    .generateConfirmEmailToken()
    .then(token => {
      return sendEmail(user, emailType.confirmEmail, 'fr', {
        link: process.env.FRONT_URL + 'auth/confirm-email/' + token
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve()
          })
        })
        .catch(err => {
          return new Promise((resolve, reject) => {
            reject(err)
          })
        })
    })
    .catch(err => {
      return new Promise((resolve, reject) => {
        reject(err)
      })
    })
}

export const signIn = async (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err)
    if (!user)
      return res.status(404).json({
        success: false,
        responseCode: ResponseCodes.wrong_credential
      })
    if (!user.state.emailVerified) {
      return res.status(401).json({
        success: false,
        responseCode: ResponseCodes.email_unverified
      })
    }
    user
      .checkPassword(req.body.password)
      .then(passwordIsValid => {
        if (!passwordIsValid)
          return res.status(401).send({
            success: false,
            responseCode: ResponseCodes.wrong_credential
          })
        const token = jwt.sign({ user: user }, config.secrets.jwt, {
          expiresIn: config.secrets.jwtExp
        })
        let firstConnection = user.state.firstConnection
        if (user.state.firstConnection) {
          user.state.firstConnection = false
          user.save(err => {
            if (err) return next(err)
            user.state.firstConnection = firstConnection
            return res.status(200).json({
              success: true,
              responseCode: ResponseCodes.token_created,
              data: {
                token: token,
                user: user
              }
            })
          })
        } else {
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.token_created,
            data: {
              token: token,
              user: user
            }
          })
        }
      })
      .catch(err => {
        next(err)
      })
  }).populate('civilStatus separationPlan')
}

export const confirmEmail = (req, res, next) => {
  User.findOneAndUpdate(
    {
      emailVerificationToken: req.body.token
    },
    {
      $set: { 'state.emailVerified': true }
    },
    (err, user) => {
      if (err) return next(err)
      if (!user)
        return res.status(403).json({
          success: false,
          responseCode: ResponseCodes.wrong_token
        })
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.email_confirmed
      })
    }
  )
}

export const generateResetPasswordToken = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err)
    if (!user)
      return res.status(404).json({
        success: false,
        responseCode: ResponseCodes.no_user_found
      })

    user
      .generateResetToken()
      .then(token => {
        sendPasswordResetEmail(user)
          .then(() => {
            return res.status(200).json({
              success: true,
              responseCode: ResponseCodes.email_sent
            })
          })
          .catch(err => {
            return next(err)
          })
      })
      .catch(err => {
        next(err)
      })
  })
}

const sendPasswordResetEmail = user => {
  return user
    .generateResetToken()
    .then(token => {
      return sendEmail(user, emailType.confirmEmail, 'fr', {
        link: process.env.FRONT_URL + 'auth/reset-password/' + token
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve()
          })
        })
        .catch(err => {
          return new Promise((resolve, reject) => {
            reject(err)
          })
        })
    })
    .catch(err => {
      return new Promise((resolve, reject) => {
        reject(err)
      })
    })
}

export const resetPassword = (req, res, next) => {
  hashPassword(req.body.password)
    .then(hash => {
      User.findOneAndUpdate(
        {
          'resetPassword.token': req.body.token,
          'resetPassword.expiresAt': { $gte: moment().toDate() }
        },
        {
          password: hash,
          $unset: { resetPassword: '' }
        },
        (err, user) => {
          if (err) return next(err)
          if (!user)
            return res.status(403).json({
              success: false,
              responseCode: ResponseCodes.wrong_token
            })
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.password_updated
          })
        }
      )
    })
    .catch(err => {
      next(err)
    })
}

export const updatePassword = (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      hashPassword(req.body.newPassword)
        .then(hash => {
          user
            .checkPassword(req.body.password)
            .then(same => {
              if (same) {
                user.password = hash
                user.save()
                return res.status(200).json({
                  success: true,
                  responseCode: ResponseCodes.password_updated
                })
              } else {
                return res.status(403).json({
                  success: false,
                  responseCode: ResponseCodes.wrong_password
                })
              }
            })
            .catch(err => {
              next(err)
            })
        })
        .catch(err => {
          next(err)
        })
    })
    .catch(err => {
      next(err)
    })
}
