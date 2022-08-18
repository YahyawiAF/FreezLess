import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import moment from '../../utils/moment'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'
let ObjectId = mongoose.Schema.Types.ObjectId

const propertyPreferenceSchema = new mongoose.Schema(
  {
    propertyType: {
      type: ObjectId,
      ref: SelectsListsTypes.propertyType
    },
    linkToProperty: {
      type: ObjectId,
      ref: SelectsListsTypes.linkToProperty
    },
    dreamProperty: {
      type: String
    },
    concept: {
      type: String
    },
    district: {
      type: Number
    },
    town: {
      type: String
    },
    extraction: {
      type: Boolean
    },
    ivLicense: {
      type: Boolean
    },
    terrace: {
      type: Boolean
    },
    employeeTakeOver: {
      type: Boolean
    },
    employeeTakeOverNegotiable: {
      type: Boolean
    },
    acquisitionWay: {
      type: ObjectId,
      ref: SelectsListsTypes.acquisitionWay
    },
    contribution: {
      type: Number
    },
    bankGuarantee: {
      type: ObjectId,
      ref: SelectsListsTypes.bankGuarantee
    },
    transferPriceMin: {
      type: Number
    },
    transferPriceMax: {
      type: Number
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

propertyPreferenceSchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

propertyPreferenceSchema.methods.toJSON = function() {
  let obj = this.toObject()
  if (this.propertyType) {
    obj.propertyType = this.propertyType.code
  }
  if (this.linkToProperty) {
    obj.linkToProperty = this.linkToProperty.code
  }
  if (this.acquisitionWay) {
    obj.acquisitionWay = this.acquisitionWay.code
  }
  if (this.bankGuarantee) {
    obj.bankGuarantee = this.bankGuarantee.code
  }
  return obj
}

propertyPreferenceSchema.plugin(uniqueValidator)

export const PropertyPreference = mongoose.model(
  'PropertyPreference',
  propertyPreferenceSchema
)
