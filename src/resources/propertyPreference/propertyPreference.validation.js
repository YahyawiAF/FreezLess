import { schema } from '../../utils/validation'
import { SelectsLists } from '../selectsLists/selectsLists.model'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'
import { PropertyPreference } from './propertyPreference.model'

export const propertyPreferenceIdSchema = {
  custom: {
    options: value => {
      return PropertyPreference.findById(value).then(propertyPreference => {
        if (!propertyPreference) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'nonExistentPropertyPreference'
  }
}

export const propertyPreferenceSanitizerSchema = {
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return PropertyPreference.findById(value).then(propertyPreference => {
        if (propertyPreference) {
          return Promise.resolve(propertyPreference)
        }
      })
    }
  }
}

const propertyTypeSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.propertyType
      }).then(propertyType => {
        if (!propertyType) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidPropertyType'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.propertyType
      }).then(propertyType => {
        if (propertyType) {
          return Promise.resolve(propertyType._id)
        }
      })
    }
  }
}

const linkToPropertySchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.linkToProperty
      }).then(linkToProperty => {
        if (!linkToProperty) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidLinkToProperty'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.linkToProperty
      }).then(linkToProperty => {
        if (linkToProperty) {
          return Promise.resolve(linkToProperty._id)
        }
      })
    }
  }
}

const acquisitionWaySchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.acquisitionWay
      }).then(acquisitionWay => {
        if (!acquisitionWay) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidLegalForm'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.acquisitionWay
      }).then(acquisitionWay => {
        if (acquisitionWay) {
          return Promise.resolve(acquisitionWay._id)
        }
      })
    }
  }
}
let variable = SelectsListsTypes.bankGuarantee
const bankGuaranteeSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: variable
      }).then(bankGuarantee => {
        if (!bankGuarantee) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidSellingReason'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.bankGuarantee
      }).then(bankGuarantee => {
        if (bankGuarantee) {
          return Promise.resolve(bankGuarantee._id)
        }
      })
    }
  }
}

const transferPriceMinSchema = {
  custom: {
    options: (value, { req }) => {
      return value > 0 && value <= req.body.transferPriceMax
    }
  },
  errorMessage: 'minGreaterThanMax'
}

const transferPriceMaxSchema = {
  custom: {
    options: (value, { req }) => {
      return value >= req.body.transferPriceMin
    }
  },
  errorMessage: 'maxLessThanMin'
}

export const propertyPreferenceValidation = {
  updateSchema: {
    propertyType: { ...schema.isOptional, ...propertyTypeSchema },
    linkToProperty: { ...schema.isOptional, ...linkToPropertySchema },
    dreamProperty: { ...schema.isOptional },
    concept: { ...schema.isOptional },
    district: { ...schema.isOptional, ...schema.isInt },
    town: { ...schema.isOptional },
    extraction: { ...schema.isOptional, ...schema.isBoolean },
    ivLicense: { ...schema.isOptional, ...schema.isBoolean },
    terrace: { ...schema.isOptional, ...schema.isBoolean },
    employeeTakeOver: { ...schema.isOptional, ...schema.isBoolean },
    employeeTakeOverNegotiable: { ...schema.isOptional, ...schema.isBoolean },
    acquisitionWay: { ...schema.isOptional, ...acquisitionWaySchema },
    contribution: { ...schema.isOptional, ...schema.isInt },
    bankGuarantee: { ...schema.isOptional, ...bankGuaranteeSchema },
    transferPriceMin: {
      ...schema.isOptional,
      ...schema.isInt,
      ...transferPriceMinSchema
    },
    transferPriceMax: {
      ...schema.isOptional,
      ...schema.isInt,
      ...transferPriceMaxSchema
    }
  }
}
