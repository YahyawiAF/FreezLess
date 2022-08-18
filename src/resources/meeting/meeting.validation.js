import { schema } from '../../utils/validation'
import {
  propertyIdSchema,
  propertySanitizerSchema
} from '../property/property.validation'
import { Meeting } from './meeting.model'
import { UploadedFile } from '../uploadedFile/uploadedFile.model'

export const meetingIdSchema = {
  custom: {
    options: value => {
      return Meeting.findById(value).then(meeting => {
        if (!meeting) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'nonExistentMeeting'
  }
}

export const meetingSanitizerSchema = {
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return Meeting.findById(value)
        .populate('dates.proposedBy dates.waitingFor property buyer')
        .then(meeting => {
          if (meeting) {
            return Promise.resolve(meeting)
          }
        })
    }
  }
}

export const offerFileIdSchema = {
  custom: {
    options: value => {
      return UploadedFile.findById(value).then(uploadedFile => {
        if (!uploadedFile) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'nonExistentFile'
  }
}

export const offerFileSanitizerSchema = {
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return UploadedFile.findById(value)
        .populate('user property meeting')
        .then(uploadedFile => {
          if (uploadedFile) {
            return Promise.resolve(uploadedFile)
          }
        })
    }
  }
}

const typeSchema = {
  isIn: {
    options: [['call', 'visit']]
  },
  errorMessage: 'invalidType'
}

const responseSchema = {
  isIn: {
    options: [['accept', 'refuse', 'report']]
  },
  errorMessage: 'invalidResponse'
}

const responseAfterMeetingSchema = {
  isIn: {
    options: [['refuse', 'needReflexion', 'interested']]
  },
  errorMessage: 'invalidResponse'
}

const responseToOfferSchema = {
  isIn: {
    options: [['accept', 'refuse']]
  },
  errorMessage: 'invalidResponse'
}

export const meetingValidation = {
  availabilitiesSchema: {
    meeting: {
      ...schema.isOptional,
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    },
    property: {
      ...schema.isOptional,
      ...schema.isMongoId,
      ...propertyIdSchema,
      ...propertySanitizerSchema
    }
  },
  proposeSchema: {
    date: { ...schema.isDate },
    type: { ...typeSchema },
    property: {
      ...schema.isMongoId,
      ...propertyIdSchema,
      ...propertySanitizerSchema
    }
  },
  respondSchema: {
    meeting: {
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    },
    response: { ...responseSchema },
    date: { ...schema.isDate },
    type: { ...typeSchema }
  },
  respondAfterMeetingSchema: {
    meeting: {
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    },
    response: { ...responseAfterMeetingSchema }
  },
  makeOfferSchema: {
    meeting: {
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    },
    offer: {
      ...schema.isMongoId,
      ...offerFileIdSchema,
      ...offerFileSanitizerSchema
    }
  },
  respondToOfferSchema: {
    meeting: {
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    },
    response: { ...responseToOfferSchema }
  },
  getPropertyMeetingsSchema: {
    property: {
      ...schema.isMongoId,
      ...propertyIdSchema,
      ...propertySanitizerSchema
    }
  },
  deleteSchema: {
    meeting: {
      ...schema.isMongoId,
      ...meetingIdSchema,
      ...meetingSanitizerSchema
    }
  }
}
