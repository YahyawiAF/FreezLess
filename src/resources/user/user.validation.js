import { schema } from '../../utils/validation'
import {
  CivilStatusList,
  SeparationPlanList
} from '../selectsLists/selectsLists.model'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'
import { UploadedFile } from '../uploadedFile/uploadedFile.model'
import { Roles } from './roles.enum'

const civilStatusSchema = {
  custom: {
    options: value => {
      return CivilStatusList.findOne({
        code: value,
        type: SelectsListsTypes.civilStatus
      }).then(civilStatus => {
        if (!civilStatus) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidCivilStatus'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return CivilStatusList.findOne({
        code: value,
        type: SelectsListsTypes.civilStatus
      }).then(civilStatus => {
        if (civilStatus) {
          return Promise.resolve(civilStatus._id)
        }
      })
    }
  }
}

const separationPlanSchema = {
  custom: {
    options: value => {
      return SeparationPlanList.findOne({
        code: value,
        type: SelectsListsTypes.separationPlan
      }).then(separationPlan => {
        if (!separationPlan) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidSeparationPlan'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SeparationPlanList.findOne({
        code: value,
        type: SelectsListsTypes.separationPlan
      }).then(separationPlan => {
        if (separationPlan) {
          return Promise.resolve(separationPlan._id)
        }
      })
    }
  }
}

const profilePictureSchema = {
  custom: {
    options: value => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (!uploadedFile) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidProfilePicture'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (uploadedFile) {
          return Promise.resolve(uploadedFile)
        }
      })
    }
  }
}

const identityDocumentSchema = {
  custom: {
    options: value => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (!uploadedFile) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidIdentityDocument'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (uploadedFile) {
          return Promise.resolve(uploadedFile)
        }
      })
    }
  }
}

const roleSchema = {
  custom: {
    options: value => {
      return new Promise((resolve, reject) => {
        value.map(role => {
          if (!(role === Roles.Buyer || role === Roles.Seller)) {
            return reject(new Error())
          }
        })
        return resolve()
      })
    },
    errorMessage: 'invalidRole'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      let isBuyer = false
      let isSeller = false
      let roles = []
      if (value !== undefined && value !== null) {
        value.map(role => {
          isBuyer = role === Roles.Buyer ? true : isBuyer
          isSeller = role === Roles.Seller ? true : isSeller
        })
        if (!isSeller && !isBuyer) {
          roles.push(Roles.Buyer)
        } else {
          roles = []
        }
        if (isBuyer) {
          roles.push(Roles.Buyer)
        }
        if (isSeller) {
          roles.push(Roles.Seller)
        }
      } else {
        roles = req.user.roles
      }
      return Promise.resolve(roles)
    }
  }
}

export const userValidation = {
  updateSchema: {
    firstName: {},
    lastName: {},
    phone: { ...schema.phone },
    civilStatus: {
      ...civilStatusSchema
    },
    separationPlan: {
      ...separationPlanSchema
    },
    profession: {},
    profilePicture: {
      ...schema.isOptional,
      ...schema.isMongoId,
      ...profilePictureSchema
    },
    identityDocument: {
      ...schema.isOptional,
      ...schema.isMongoId,
      ...identityDocumentSchema
    },
    roles: {
      ...roleSchema
    }
  },
  updateAvailabilitiesSchema: {
    availabilities: { ...schema.isArray },
    'availabilities.*.start': { ...schema.isDate },
    'availabilities.*.end': { ...schema.isDate }
  },
  setFcmTokenSchema: {
    token: { ...schema.required }
  }
}
