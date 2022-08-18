import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { Roles } from './roles.enum'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'
import moment from '../../utils/moment'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'

let ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
      trim: true,
      set: v => v.toLowerCase()
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    civilStatus: {
      type: ObjectId,
      ref: SelectsListsTypes.civilStatus
    },
    separationPlan: {
      type: ObjectId,
      ref: SelectsListsTypes.separationPlan
    },
    profession: {
      type: String
    },
    otherProfession: {
      type: String
    },
    properties: [
      {
        type: ObjectId,
        ref: 'Property'
      }
    ],
    favoritesProperties: [
      {
        type: ObjectId,
        ref: 'Property'
      }
    ],
    propertyPreferences: [
      {
        type: ObjectId,
        ref: 'PropertyPreference'
      }
    ],
    profilePicture: {
      type: ObjectId,
      ref: 'UploadedFile'
    },
    identityDocument: [
      {
        type: ObjectId,
        ref: 'UploadedFile'
      }
    ],
    availabilities: [
      {
        start: {
          type: Date
        },
        end: {
          type: Date
        }
      }
    ],
    roles: [
      {
        type: String,
        enum: Roles.values
      }
    ],
    state: {
      emailVerified: {
        type: Boolean,
        required: true,
        default: false
      },
      firstConnection: {
        type: Boolean,
        required: true,
        default: true
      }
    },
    notifications: [
      {
        title: {
          type: String,
          required: true
        },
        text: {
          type: String,
          required: true
        },
        type: {
          type: String,
          required: true
        },
        url: {
          type: String
        },
        isOpened: {
          type: Boolean,
          required: true,
          default: false
        },
        createdAt: {
          type: Date,
          default: moment
        }
      }
    ],
    emailVerificationToken: {
      type: String
    },
    resetPassword: {
      token: {
        type: String
      },
      expiresAt: {
        type: Date
      }
    },
    fcmToken: {
      type: String
    },
    createdAt: {
      type: Date,
      default: moment
    },
    updatedAt: {
      type: Date,
      default: moment
    }
  },
  {}
)

userSchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) reject(err)
      resolve(same)
    })
  })
}

userSchema.methods.toJSON = function() {
  let obj = this.toObject()
  if (this.civilStatus) {
    obj.civilStatus = this.civilStatus.code
  }
  if (this.separationPlan) {
    obj.separationPlan = this.separationPlan.code
  }
  delete obj.password
  delete obj.emailVerificationToken
  delete obj.resetPassword
  return obj
}

userSchema.methods.generateConfirmEmailToken = function() {
  let user = this
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, function(err, buffer) {
      if (err) reject(err)
      try {
        let token = buffer.toString('hex')
        user.emailVerificationToken = token
        user.save()
        resolve(token)
      } catch (err) {
        reject(err)
      }
    })
  })
}

userSchema.methods.generateResetToken = function() {
  let user = this
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, function(err, buffer) {
      if (err) reject(err)
      try {
        let token = buffer.toString('hex')
        user.resetPassword = {}
        user.resetPassword.token = token
        user.resetPassword.expiresAt = moment()
          .add(8, 'hour')
          .toDate()
        user.save()
        resolve(token)
      } catch (err) {
        reject(err)
      }
    })
  })
}

userSchema.methods.addProperty = function(propertyId) {
  let user = this
  let properties = user.properties.map(property => property.id)
  if (!properties.includes(propertyId)) {
    user.properties.push(propertyId)
  }
}

userSchema.methods.addRemoveFavoritesProperties = function(propertyId) {
  let user = this
  if (!user.favoritesProperties.includes(propertyId)) {
    user.favoritesProperties.push(propertyId)
    return true
  } else {
    user.favoritesProperties.splice(
      user.favoritesProperties.indexOf(propertyId),
      1
    )
    return false
  }
}

userSchema.methods.addPropertyPreference = function(propertyPreferenceId) {
  let user = this
  if (!user.propertyPreferences.includes(propertyPreferenceId)) {
    user.propertyPreferences.push(propertyPreferenceId)
  }
}

userSchema.methods.addRole = function(role) {
  let user = this
  if (!user.roles.includes(role)) {
    user.roles.push(role)
  }
}

userSchema.methods.haveRole = function(role) {
  let user = this
  if (!user.roles.includes(role)) {
    return true
  }
  return false
}

userSchema.methods.addNotification = function(title, text, type, url) {
  let user = this
  user.notifications.push({
    title: title,
    text: text,
    type: type,
    url: url
  })
}

userSchema.methods.openNotification = function(id) {
  let user = this
  let index = user.notifications.findIndex(n => n.id === id)
  user.notifications[index].isOpened = true
}

export const hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
}

userSchema.plugin(uniqueValidator)

export const User = mongoose.model('User', userSchema)
