import { Property } from '../property/property.model'
import { ResponseCodes } from '../../utils/responseCodes'
import { User } from '../user/user.model'
import {
  addIsFavorite,
  addIsFavoriteToArray,
  addMeetingStatus,
  getPropertiesWithUserPreferences,
  getVisitedPropertiesService
} from './property.service'
import { Meeting } from '../meeting/meeting.model'
import moment from '../../utils/moment'

export const getProperty = (req, res, next) => {
  let propertyId = req.body.id
  if (!propertyId) {
    if (req.user.properties) {
      if (req.user.properties[0]) {
        propertyId = req.user.properties[0]
      } else {
        return res.status(201).json({
          success: true,
          responseCode: ResponseCodes.no_property_id
        })
      }
    }
  }
  Property.findById(propertyId, (err, property) => {
    if (err) return next(err)
    if (!property) {
      return res.status(201).json({
        success: false,
        responseCode: ResponseCodes.wrong_id
      })
    }
    return res.status(201).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: property
    })
  }).populate(
    'propertyType ' +
      'linkToProperty ' +
      'legalForm ' +
      'sellingReason ' +
      'premisesState ' +
      'servicesTime ' +
      'leaseDuration ' +
      'leaseRenewal ' +
      'leaseOwnerAnswer'
  )
}

export const updateProperty = (req, res, next) => {
  let user = req.user
  let property = null
  if (user.properties) {
    property = user.properties[0]
  }
  if (!property) {
    property = new Property()
  }
  property = Object.assign(property, req.body)
  property.user = user._id
  user.addProperty(property.id)
  property.save((err, savedProperty) => {
    if (err) return next(err)
    user.save((err, user) => {
      if (err) return next(err)
      Property.populate(savedProperty, {
        path:
          'propertyType ' +
          'linkToProperty ' +
          'legalForm ' +
          'sellingReason ' +
          'premisesState ' +
          'servicesTime ' +
          'leaseDuration ' +
          'leaseRenewal ' +
          'leaseOwnerAnswer'
      })
        .then(() => {
          return res.status(201).json({
            success: true,
            responseCode: ResponseCodes.property_updated,
            data: savedProperty
          })
        })
        .catch(err => {
          return next(err)
        })
    })
  })
}

export const getPropertiesList = (req, res, next) => {
  let user = req.user
  getPropertiesWithUserPreferences(user)
    .then(properties => {
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: properties
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const getPropertyDetails = (req, res, next) => {
  let user = req.user
  let property = req.body.property
  property.seen++
  addIsFavorite(property, user.favoritesProperties)
  property.save((err, savedProperty) => {
    if (err) return next(err)
    Meeting.findOne({ buyer: user.id, property: property }, (err, meeting) => {
      if (err) return next(err)
      property = addMeetingStatus(property, meeting)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: {
          property: property.getPropertyDetails(),
          meeting: meeting
        }
      })
    })
  })
}

export const likeProperty = (req, res, next) => {
  let property = req.body.property
  let user = req.user
  if (
    !user.properties.find(p => {
      return p.id === property.id
    })
  ) {
    let isLiked = user.addRemoveFavoritesProperties(property.id)
    user.save((err, savedProperty) => {
      if (err) return next(err)
      if (isLiked) {
        property.likes++
        property.save((err, savedProperty) => {
          if (err) return next(err)
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.property_liked
          })
        })
      } else {
        property.likes--
        property.save((err, savedProperty) => {
          if (err) return next(err)
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.property_disliked
          })
        })
      }
    })
  } else {
    return res.status(409).json({
      success: true,
      responseCode: ResponseCodes.no_like_own_property
    })
  }
}

export const getFavorites = (req, res, next) => {
  let user = req.user
  User.populate(user, { path: 'favoritesProperties' })
    .then(() => {
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: user.favoritesProperties.map(property => {
          return property.getPublicPropertyForList()
        })
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const getVisitedProperties = (req, res, next) => {
  let user = req.user
  getVisitedPropertiesService(user)
    .then(properties => {
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: {
          properties: properties
        }
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const getAllProperties = (req, res, next) => {
  Property.find({}, function(err, properties) {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: properties
    })
  })
}

export const deleteProperty = (req, res, next) => {
  let propertyId = req.body.id
  Property.findById(propertyId, function(err, property) {
    if (err) return next(err)
    property.deletedAt = moment()
    property.save((err, savedProperty) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.propertyDeleted
      })
    })
  })
}

export const validateProperty = (req, res, next) => {
  let property = req.body.property
  property.publishedAt = moment()
  property.validatedBy = req.user.id
  property.save((err, savedProperty) => {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.propertyValidated
    })
  })
}
