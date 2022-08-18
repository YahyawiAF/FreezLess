import { schema } from '../../utils/validation'
import { SelectsLists } from '../selectsLists/selectsLists.model'

const selectsListsSchema = {
  custom: {
    options: value => {
      return SelectsLists.findById(value).then(selectsLists => {
        if (!selectsLists) {
          return Promise.reject(new Error())
        }
      })
    },
    errorMessage: 'invalidSelectsLists'
  },
  customSanitizer: {
    options: (value, { req, location, path }) => {
      return SelectsLists.findById(value).then(selectsLists => {
        if (selectsLists) {
          return Promise.resolve(selectsLists)
        }
      })
    }
  }
}

export const selectsListsValidation = {
  addSchema: {
    id: {
      ...schema.isOptional,
      ...schema.isMongoId,
      ...selectsListsSchema
    },
    code: {
      ...schema.required,
      ...schema.isLettersNumbersAndUnderline
    },
    displayedLabel: {
      ...schema.required
    },
    parent: {
      ...schema.isOptional,
      ...schema.required,
      ...schema.isMongoId,
      ...selectsListsSchema
    },
    selectable: {
      ...schema.isOptional,
      ...schema.required,
      ...schema.isBoolean
    },
    neededForPublication: {
      ...schema.isOptional,
      ...schema.required,
      ...schema.isBoolean
    },
    neededForDisposal: {
      ...schema.isOptional,
      ...schema.required,
      ...schema.isBoolean
    }
  }
}
