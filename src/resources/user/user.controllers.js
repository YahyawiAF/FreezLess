import { User } from './user.model'
import { ResponseCodes } from '../../utils/responseCodes'
import { Meeting } from '../meeting/meeting.model'
import { removeRedundancyAvailability } from '../meeting/meeting.service'
import { sendNotificationToUser } from '../../utils/notifications'
import { hasRole } from '../../utils/authorization'
import { Roles } from './roles.enum'

export const getConnectedUser = (req, res, next) => {
  return res.status(200).json({
    success: true,
    responseCode: ResponseCodes.data,
    data: req.user
  })
}

export const getUserProfileById = (req, res, next) => {
  let user = req.user
  let userId = user.id
  if (hasRole(user, Roles.Admin) && req.body.user) {
    userId = req.body.user
  }
  User.findById(userId, (err, foundUser) => {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: foundUser
    })
  })
}
export const updateUser = (req, res, next) => {
  let user = req.user
  if (hasRole(user, Roles.Admin) && req.body.user) {
    user = req.body.user
  }
  let updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    civilStatus: req.body.civilStatus,
    separationPlan: req.body.separationPlan,
    profession: req.body.profession,
    profilePicture: req.body.profilePicture,
    identityDocument: req.body.identityDocument,
    roles: req.body.roles
  }
  User.findByIdAndUpdate(
    user._id,
    updatedUser,
    { new: true },
    (err, updatedUser) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.user_updated,
        data: updatedUser
      })
    }
  ).populate(
    'civilStatus separationPlan properties propertyPreference profilePicture identityDocument'
  )
}

export const updateAvailabilities = (req, res, next) => {
  let user = req.user
  if (hasRole(user, Roles.Admin) && req.body.user) {
    user = req.body.user
  }
  let availabilities = req.body.availabilities
  for (let i = 0; i < availabilities.length; i++) {
    if (availabilities[i].start > availabilities[i].end) {
      let d = availabilities[i].start
      availabilities[i].start = availabilities[i].end
      availabilities[i].end = d
    }
  }
  availabilities = [].concat(removeRedundancyAvailability(availabilities))
  availabilities = availabilities.map(availability => {
    return { start: availability.start, end: availability.end }
  })
  console.log(availabilities)
  User.findByIdAndUpdate(
    user._id,
    {
      availabilities: availabilities
    },
    { new: true },
    (err, savedUser) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.availabilities_updated,
        data: savedUser
      })
    }
  ).populate('civilStatus separationPlan')
}

export const getCalendar = (req, res, next) => {
  let user = req.user
  User.populate(user, { path: 'property propertyPreference' })
    .then(() => {
      let availabilities = user.availabilities
      Meeting.find({
        $or: [
          { buyer: user._id },
          { property: { $in: user.properties ? user.properties : [] } },
          {
            propertyPreference: {
              $in: user.propertyPreference ? user.propertyPreference : []
            }
          }
        ]
      })
        .populate('dates.proposedBy property')
        .then(meetings => {
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.data,
            data: {
              availabilities: availabilities,
              meetings: meetings
            }
          })
        })
        .catch(err => {
          return next(err)
        })
    })
    .catch(err => {
      return next(err)
    })
}

export const setFcmToken = (req, res, next) => {
  let user = req.user
  user.fcmToken = req.body.token
  user.save((err, user) => {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.fcm_token_saved
    })
  })
}

export const testNotifications = (req, res, next) => {
  sendNotificationToUser(req.user)
    .then(response => {
      return res.status(200).json({
        success: true,
        responseCode: 'notification sent bro'
      })
    })
    .catch(error => {
      return res.status(200).json({
        success: true,
        responseCode: 'Oh Oh !! problem',
        error: error
      })
    })
}

export const getNotifications = (req, res, next) => {
  let user = req.user
  return res.status(200).json({
    success: true,
    responseCode: ResponseCodes.data,
    data: user.notifications
  })
}

export const getAllUsers = (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: users
    })
  }).populate('properties')
}

export const getUserByID = (req, res, next) => {
  User.findById(req.body.id, function(err, user) {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: user
    })
  }).populate('properties')
}
