import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import moment from '../../utils/moment'
import { SelectsListsTypes } from '../selectsLists/selectsListsTypes.enum'
import { MeetingStatus } from './meetingStatus.enum'

let ObjectId = mongoose.Schema.Types.ObjectId

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    propertyType: {
      type: ObjectId,
      ref: SelectsListsTypes.propertyType
    },
    linkToProperty: {
      type: ObjectId,
      ref: SelectsListsTypes.linkToProperty
    },
    legalForm: {
      type: ObjectId,
      ref: SelectsListsTypes.legalForm
    },
    siret: {
      type: Number,
      sparse: true
    },
    sellingReason: {
      type: ObjectId,
      ref: SelectsListsTypes.sellingReason
    },
    district: {
      type: Number
    },
    address: {
      type: String
    },
    postalCode: {
      type: Number
    },
    town: {
      type: String
    },
    cornerBusiness: {
      type: Boolean
    },
    totalAreaSize: {
      type: Number
    },
    kitchen: {
      type: Boolean
    },
    kitchenLevel: {
      type: Number
    },
    kitchenAreaSize: {
      type: Number
    },
    wc: {
      type: Boolean
    },
    wcLevel: {
      type: Number
    },
    terrace: {
      type: Boolean
    },
    terracePlatesNbre: {
      type: Number
    },
    extraction: {
      type: Boolean
    },
    linearShowcase: {
      type: Number
    },
    interiorPlatesNbre: {
      type: Number
    },
    ivLicense: {
      type: Boolean
    },
    housing: {
      type: Boolean
    },
    housingAreaSize: {
      type: Number
    },
    premisesState: {
      type: ObjectId,
      ref: SelectsListsTypes.premisesState
    },
    reparationNeeded: {
      type: Boolean
    },
    turnover: {
      type: Number
    },
    heldSince: {
      type: Date
    },
    servicesTime: {
      type: ObjectId,
      ref: SelectsListsTypes.servicesTime
    },
    workingDaysNbre: {
      type: Number
    },
    annualLeave: {
      type: String
    },
    leaseOwner: {
      type: Boolean
    },
    leaseDuration: {
      type: ObjectId,
      ref: SelectsListsTypes.leaseDuration
    },
    leaseRenewal: {
      type: ObjectId,
      ref: SelectsListsTypes.leaseRenewal
    },
    leaseRenewalDate: {
      type: Date
    },
    leaseRenewalExtraJudicialDocument: {
      type: Boolean
    },
    leaseRenewalRequestSince3Months: {
      type: Boolean
    },
    leaseNewProposition: {
      type: Boolean
    },
    leaseNewRent: {
      type: Number
    },
    leaseOwnerAnswer: {
      type: ObjectId,
      ref: SelectsListsTypes.leaseOwnerAnswer
    },
    leaseAuthorizedActivity: {
      type: String
    },
    monthlyRent: {
      type: Number
    },
    employeeTakeOver: {
      type: Boolean
    },
    disabledStandards: {
      type: Boolean
    },
    suggestedPriceMin: {
      type: Number
    },
    suggestedPriceMax: {
      type: Number
    },
    price: {
      type: Number
    },
    priceIsNegotiable: {
      type: Boolean
    },
    mandatoryIdVisitation: {
      type: Boolean
    },
    seen: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    validatedBy: {
      type: ObjectId,
      ref: 'User'
    },
    publishedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: moment
    },
    updatedAt: {
      type: Date,
      default: moment
    },
    deletedAt: {
      type: Date
    }
  },
  {}
)

propertySchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

const replaceListsCodes = property => {
  if (property.propertyType) {
    property.propertyType = property.propertyType.code
  }
  if (property.linkToProperty) {
    property.linkToProperty = property.linkToProperty.code
  }
  if (property.legalForm) {
    property.legalForm = property.legalForm.code
  }
  if (property.sellingReason) {
    property.sellingReason = property.sellingReason.code
  }
  if (property.premisesState) {
    property.premisesState = property.premisesState.code
  }
  if (property.servicesTime) {
    property.servicesTime = property.servicesTime.code
  }
  if (property.leaseDuration) {
    property.leaseDuration = property.leaseDuration.code
  }
  if (property.leaseRenewal) {
    property.leaseRenewal = property.leaseRenewal.code
  }
  if (property.leaseOwnerAnswer) {
    property.leaseOwnerAnswer = property.leaseOwnerAnswer.code
  }
  return property
}

propertySchema.methods.toJSON = function() {
  let obj = this.toObject()
  obj = replaceListsCodes(obj)
  return obj
}

propertySchema.methods.getPropertyDetails = function() {
  switch (this.meetingStatus) {
    case MeetingStatus.none:
    case MeetingStatus.proposed:
    case MeetingStatus.refused:
    case MeetingStatus.reported:
      return replaceListsCodes({
        id: this.id,
        name: this.name,
        propertyType: this.propertyType,
        district: this.district,
        price: this.price,
        totalAreaSize: this.totalAreaSize,
        kitchen: this.kitchen,
        kitchenLevel: this.kitchenLevel,
        kitchenAreaSize: this.kitchenAreaSize,
        wc: this.wc,
        wcLevel: this.wcLevel,
        terrace: this.terrace,
        terracePlatesNbre: this.terracePlatesNbre,
        interiorPlatesNbre: this.interiorPlatesNbre,
        extraction: this.extraction,
        linearShowcase: this.linearShowcase,
        ivLicense: this.ivLicense,
        housing: this.housing,
        turnover: this.turnover,
        heldSince: this.heldSince,
        servicesTime: this.servicesTime,
        workingDaysNbre: this.workingDaysNbre,
        monthlyRent: this.monthlyRent,
        leaseRenewal: this.leaseRenewal,
        leaseRenewalDate: this.leaseRenewalDate,
        isFavorite: this.isFavorite,
        meetingStatus: this.meetingStatus
      })
    case MeetingStatus.accepted:
      return replaceListsCodes({
        id: this.id,
        publishedAt: this.publishedAt,
        propertyType: this.propertyType,
        district: this.district,
        address: this.address,
        postalCode: this.postalCode,
        town: this.town,
        cornerBusiness: this.cornerBusiness,
        price: this.price,
        totalAreaSize: this.totalAreaSize,
        kitchen: this.kitchen,
        kitchenLevel: this.kitchenLevel,
        kitchenAreaSize: this.kitchenAreaSize,
        wc: this.wc,
        wcLevel: this.wcLevel,
        terrace: this.terrace,
        terracePlatesNbre: this.terracePlatesNbre,
        interiorPlatesNbre: this.interiorPlatesNbre,
        extraction: this.extraction,
        ivLicense: this.ivLicense,
        housing: this.housing,
        turnover: this.turnover,
        heldSince: this.heldSince,
        servicesTime: this.servicesTime,
        workingDaysNbre: this.workingDaysNbre,
        monthlyRent: this.monthlyRent,
        leaseRenewal: this.leaseRenewal,
        leaseRenewalDate: this.leaseRenewalDate,
        isFavorite: this.isFavorite,
        user: {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
          profilePicture: this.user.profilePicture
        },
        sellingReason: this.sellingReason,
        meetingStatus: this.meetingStatus
      })
    case MeetingStatus.supposedlyDone:
      return replaceListsCodes({
        id: this.id,
        publishedAt: this.publishedAt,
        propertyType: this.propertyType,
        district: this.district,
        address: this.address,
        postalCode: this.postalCode,
        town: this.town,
        cornerBusiness: this.cornerBusiness,
        price: this.price,
        totalAreaSize: this.totalAreaSize,
        kitchen: this.kitchen,
        kitchenLevel: this.kitchenLevel,
        kitchenAreaSize: this.kitchenAreaSize,
        wc: this.wc,
        wcLevel: this.wcLevel,
        terrace: this.terrace,
        terracePlatesNbre: this.terracePlatesNbre,
        interiorPlatesNbre: this.interiorPlatesNbre,
        extraction: this.extraction,
        linearShowcase: this.linearShowcase,
        ivLicense: this.ivLicense,
        housing: this.housing,
        turnover: this.turnover,
        heldSince: this.heldSince,
        servicesTime: this.servicesTime,
        workingDaysNbre: this.workingDaysNbre,
        monthlyRent: this.monthlyRent,
        leaseRenewal: this.leaseRenewal,
        leaseRenewalDate: this.leaseRenewalDate,
        isFavorite: this.isFavorite,
        disabledStandards: this.disabledStandards,
        user: {
          firstName: this.user ? this.user.firstName : undefined,
          lastName: this.user ? this.user.lastName : undefined,
          email: this.user ? this.user.email : undefined,
          phone: this.user ? this.user.phone : undefined,
          profilePicture: this.user ? this.user.profilePicture : undefined
        },
        sellingReason: this.sellingReason,
        meetingStatus: this.meetingStatus
      })
  }
}

propertySchema.methods.getPublicPropertyForList = function() {
  return replaceListsCodes({
    id: this.id,
    name: this.name,
    price: this.price,
    totalAreaSize: this.totalAreaSize,
    cornerBusiness: this.cornerBusiness,
    extraction: this.extraction,
    turnover: this.turnover,
    district: this.district,
    address: this.address,
    town: this.town,
    isFavorite: this.isFavorite,
    publishedAt: this.publishedAt
  })
}

propertySchema.plugin(uniqueValidator)

export const Property = mongoose.model('Property', propertySchema)
