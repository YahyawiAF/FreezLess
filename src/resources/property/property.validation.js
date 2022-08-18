import { schema } from '../../utils/validation'
import { SelectsLists } from '../selectsLists/selectsLists.model'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'
import { Property } from './property.model'

export const propertyIdSchema = {
  custom: {
    options: value => {
      return Property.findById(value).then(Property => {
        if (!Property) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'nonExistentProperty'
  }
}

export const propertySanitizerSchema = {
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return Property.findById(value)
        .populate(
          'propertyType ' +
            'linkToProperty ' +
            'legalForm ' +
            'sellingReason ' +
            'premisesState ' +
            'servicesTime ' +
            'leaseDuration ' +
            'leaseRenewal ' +
            'leaseOwnerAnswer ' +
            'user'
        )
        .then(property => {
          if (property) {
            return Promise.resolve(property)
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

const legalFormSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.legalForm
      }).then(legalForm => {
        if (!legalForm) {
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
        type: SelectsListsTypes.legalForm
      }).then(legalForm => {
        if (legalForm) {
          return Promise.resolve(legalForm._id)
        }
      })
    }
  }
}

const sellingReasonSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.sellingReason
      }).then(sellingReason => {
        if (!sellingReason) {
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
        type: SelectsListsTypes.sellingReason
      }).then(sellingReason => {
        if (sellingReason) {
          return Promise.resolve(sellingReason._id)
        }
      })
    }
  }
}

const premisesStateSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.premisesState
      }).then(premisesState => {
        if (!premisesState) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidPremisesState'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.premisesState
      }).then(premisesState => {
        if (premisesState) {
          return Promise.resolve(premisesState._id)
        }
      })
    }
  }
}

const servicesTimeSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.servicesTime
      }).then(servicesTime => {
        if (!servicesTime) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidServicesTime'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.servicesTime
      }).then(servicesTime => {
        if (servicesTime) {
          return Promise.resolve(servicesTime._id)
        }
      })
    }
  }
}

const leaseDurationSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseDuration
      }).then(leaseDuration => {
        if (!leaseDuration) {
          return Promise.resolve(Promise.reject(new Error()))
        }
      })
    },
    errorMessage: 'invalidLeaseDuration'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseDuration
      }).then(leaseDuration => {
        if (leaseDuration) {
          return Promise.resolve(leaseDuration._id)
        }
      })
    }
  }
}

const leaseRenewalSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseRenewal
      }).then(leaseRenewal => {
        if (!leaseRenewal) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidLeaseRenewal'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseRenewal
      }).then(leaseRenewal => {
        if (leaseRenewal) {
          return Promise.resolve(leaseRenewal._id)
        }
      })
    }
  }
}

const leaseOwnerAnswerSchema = {
  custom: {
    options: value => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseOwnerAnswer
      }).then(leaseOwnerAnswer => {
        if (!leaseOwnerAnswer) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidLeaseOwnerAnswer'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findOne({
        code: value,
        type: SelectsListsTypes.leaseOwnerAnswer
      }).then(leaseOwnerAnswer => {
        if (leaseOwnerAnswer) {
          return Promise.resolve(leaseOwnerAnswer._id)
        }
      })
    }
  }
}

const suggestedPriceMinSchema = {
  custom: {
    options: (value, { req }) => {
      return value > 0 && value <= req.body.suggestedPriceMax
    }
  },
  errorMessage: 'minGreaterThanMax'
}

const suggestedPriceMaxSchema = {
  custom: {
    options: (value, { req }) => {
      return value >= req.body.suggestedPriceMin
    }
  },
  errorMessage: 'maxLessThanMin'
}

export const propertyValidation = {
  updateSchema: {
    propertyType: { ...schema.isOptional, ...propertyTypeSchema },
    linkToProperty: { ...schema.isOptional, ...linkToPropertySchema },
    legalForm: { ...schema.isOptional, ...legalFormSchema },
    siret: { ...schema.isOptional, ...schema.isInt },
    sellingReason: { ...schema.isOptional, ...sellingReasonSchema },
    district: { ...schema.isOptional, ...schema.isInt },
    address: { ...schema.isOptional },
    postalCode: { ...schema.isOptional, ...schema.isInt },
    town: { ...schema.isOptional },
    cornerBusiness: { ...schema.isOptional, ...schema.isBoolean },
    totalAreaSize: { ...schema.isOptional, ...schema.isNumeric },
    kitchen: { ...schema.isOptional, ...schema.isBoolean },
    kitchenLevel: { ...schema.isOptional, ...schema.isInt },
    kitchenAreaSize: { ...schema.isOptional, ...schema.isNumeric },
    wc: { ...schema.isOptional, ...schema.isBoolean },
    wcLevel: { ...schema.isOptional, ...schema.isInt },
    terrace: { ...schema.isOptional, ...schema.isBoolean },
    terracePlatesNbre: { ...schema.isOptional, ...schema.isInt },
    extraction: { ...schema.isOptional, ...schema.isBoolean },
    linearShowcase: { ...schema.isOptional, ...schema.isNumeric },
    interiorPlatesNbre: { ...schema.isOptional, ...schema.isInt },
    ivLicense: { ...schema.isOptional, ...schema.isBoolean },
    housing: { ...schema.isOptional, ...schema.isBoolean },
    housingAreaSize: { ...schema.isOptional, ...schema.isNumeric },
    premisesState: { ...schema.isOptional, ...premisesStateSchema },
    reparationNeeded: { ...schema.isOptional, ...schema.isBoolean },
    turnover: { ...schema.isOptional, ...schema.isNumeric },
    heldSince: { ...schema.isOptional, ...schema.isDate, ...schema.toDate },
    servicesTime: { ...schema.isOptional, ...servicesTimeSchema },
    workingDaysNbre: { ...schema.isOptional, ...schema.isInt },
    annualLeave: { ...schema.isOptional },
    leaseOwner: { ...schema.isOptional, ...schema.isBoolean },
    leaseDuration: { ...schema.isOptional, ...leaseDurationSchema },
    leaseRenewal: { ...schema.isOptional, ...leaseRenewalSchema },
    leaseRenewalDate: {
      ...schema.isOptional,
      ...schema.isDate,
      ...schema.toDate
    },
    leaseRenewalExtraJudicialDocument: {
      ...schema.isOptional,
      ...schema.isBoolean
    },
    leaseRenewalRequestSince3Months: {
      ...schema.isOptional,
      ...schema.isBoolean
    },
    leaseNewProposition: { ...schema.isOptional, ...schema.isBoolean },
    leaseNewRent: { ...schema.isOptional, ...schema.isNumeric },
    leaseOwnerAnswer: { ...schema.isOptional, ...leaseOwnerAnswerSchema },
    leaseAuthorizedActivity: { ...schema.isOptional },
    monthlyRent: { ...schema.isOptional, ...schema.isNumeric },
    employeeTakeOver: { ...schema.isOptional, ...schema.isBoolean },
    disabledStandards: { ...schema.isOptional, ...schema.isBoolean },
    suggestedPriceMin: {
      ...suggestedPriceMinSchema,
      ...schema.isOptional,
      ...schema.isNumeric
    },
    suggestedPriceMax: {
      ...suggestedPriceMaxSchema,
      ...schema.isOptional,
      ...schema.isNumeric
    },
    price: { ...schema.isOptional, ...schema.isNumeric },
    priceIsNegotiable: { ...schema.isOptional, ...schema.isBoolean },
    mandatoryIdVisitation: { ...schema.isOptional, ...schema.isBoolean }
  },
  getPublicSchema: {
    property: { ...propertyIdSchema, ...propertySanitizerSchema }
  },
  likePropertySchema: {
    property: { ...propertyIdSchema, ...propertySanitizerSchema }
  }
}
