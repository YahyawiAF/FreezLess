import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import moment from '../../utils/moment'
import { SelectsListsTypes } from './selectsListsTypes.enum'

let ObjectId = mongoose.Schema.Types.ObjectId

const selectsListsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    displayedLabel: {
      type: String,
      required: true
    },
    parent: {
      type: ObjectId
    },
    selectable: {
      type: Boolean,
      default: true
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
  { discriminatorKey: 'type' }
)

selectsListsSchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

selectsListsSchema.methods.toJSON = function() {
  return this.toObject()
}

selectsListsSchema.plugin(uniqueValidator)

export const SelectsLists = mongoose.model('SelectsLists', selectsListsSchema)

export const PropertyTypeList = SelectsLists.discriminator(
  SelectsListsTypes.propertyType,
  new mongoose.Schema({})
)
export const LinkToPropertyList = SelectsLists.discriminator(
  SelectsListsTypes.linkToProperty,
  new mongoose.Schema({})
)
export const LegalFormList = SelectsLists.discriminator(
  SelectsListsTypes.legalForm,
  new mongoose.Schema({})
)
export const SellingReasonList = SelectsLists.discriminator(
  SelectsListsTypes.sellingReason,
  new mongoose.Schema({})
)
export const PremisesStateList = SelectsLists.discriminator(
  SelectsListsTypes.premisesState,
  new mongoose.Schema({})
)
export const ServicesTimeList = SelectsLists.discriminator(
  SelectsListsTypes.servicesTime,
  new mongoose.Schema({})
)
export const LeaseDurationList = SelectsLists.discriminator(
  SelectsListsTypes.leaseDuration,
  new mongoose.Schema({})
)
export const LeaseRenewalList = SelectsLists.discriminator(
  SelectsListsTypes.leaseRenewal,
  new mongoose.Schema({})
)
export const LeaseOwnerAnswerList = SelectsLists.discriminator(
  SelectsListsTypes.leaseOwnerAnswer,
  new mongoose.Schema({})
)
export const CivilStatusList = SelectsLists.discriminator(
  SelectsListsTypes.civilStatus,
  new mongoose.Schema({})
)
export const SeparationPlanList = SelectsLists.discriminator(
  SelectsListsTypes.separationPlan,
  new mongoose.Schema({})
)
export const AcquisitionWayList = SelectsLists.discriminator(
  SelectsListsTypes.acquisitionWay,
  new mongoose.Schema({})
)
export const BankGuaranteeList = SelectsLists.discriminator(
  SelectsListsTypes.bankGuarantee,
  new mongoose.Schema({})
)
export const DocumentList = SelectsLists.discriminator(
  SelectsListsTypes.document,
  new mongoose.Schema({
    neededForPublication: {
      type: Boolean,
      default: false
    },
    neededForDisposal: {
      type: Boolean,
      default: false
    }
  })
)

export const createSelectsListsInstance = (selectsListsType, object) => {
  switch (selectsListsType) {
    case SelectsListsTypes.propertyType:
      return new PropertyTypeList(object)
    case SelectsListsTypes.linkToProperty:
      return new LinkToPropertyList(object)
    case SelectsListsTypes.legalForm:
      return new LegalFormList(object)
    case SelectsListsTypes.sellingReason:
      return new SellingReasonList(object)
    case SelectsListsTypes.premisesState:
      return new PremisesStateList(object)
    case SelectsListsTypes.servicesTime:
      return new ServicesTimeList(object)
    case SelectsListsTypes.leaseDuration:
      return new LeaseDurationList(object)
    case SelectsListsTypes.leaseRenewal:
      return new LeaseRenewalList(object)
    case SelectsListsTypes.leaseOwnerAnswer:
      return new LeaseOwnerAnswerList(object)
    case SelectsListsTypes.civilStatus:
      return new CivilStatusList(object)
    case SelectsListsTypes.separationPlan:
      return new SeparationPlanList(object)
    case SelectsListsTypes.acquisitionWay:
      return new AcquisitionWayList(object)
    case SelectsListsTypes.bankGuarantee:
      return new BankGuaranteeList(object)
    case SelectsListsTypes.document:
      return new DocumentList(object)
    default:
      return new SelectsLists(object)
  }
}
