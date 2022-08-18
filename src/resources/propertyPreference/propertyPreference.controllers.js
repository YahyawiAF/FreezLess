import { PropertyPreference } from '../propertyPreference/propertyPreference.model'
import { ResponseCodes } from '../../utils/responseCodes'

export const getPropertyPreference = (req, res, next) => {
  let propertyPreferenceId = req.body.id
  if (!propertyPreferenceId) {
    if (req.user.propertyPreferences) {
      if (req.user.propertyPreferences[0]) {
        propertyPreferenceId = req.user.propertyPreferences[0]
      } else {
        return res.status(201).json({
          success: true,
          responseCode: ResponseCodes.no_property_preference_id
        })
      }
    }
  }
  PropertyPreference.findById(
    propertyPreferenceId,
    (err, propertyPreference) => {
      if (err) return next(err)
      if (!propertyPreference) {
        return res.status(201).json({
          success: false,
          responseCode: ResponseCodes.wrong_id
        })
      }
      return res.status(201).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: propertyPreference
      })
    }
  ).populate(
    'propertyType ' + 'linkToProperty ' + 'acquisitionWay ' + 'bankGuarantee'
  )
}

export const updatePropertyPreference = (req, res, next) => {
  let user = req.user
  let propertyPreferenceId = null
  if (req.user.propertyPreferences) {
    propertyPreferenceId = req.user.propertyPreferences[0]
  }
  PropertyPreference.findById(
    propertyPreferenceId,
    (err, propertyPreference) => {
      if (err) return next(err)
      if (!propertyPreference) {
        propertyPreference = new PropertyPreference()
      }
      propertyPreference = Object.assign(propertyPreference, req.body)
      propertyPreference.user = user._id
      user.addPropertyPreference(propertyPreference.id)
      propertyPreference.save((err, savedPropertyPreference) => {
        if (err) return next(err)
        user.save((err, user) => {
          if (err) return next(err)
          PropertyPreference.populate(savedPropertyPreference, {
            path:
              'propertyType ' +
              'linkToProperty ' +
              'acquisitionWay ' +
              'bankGuarantee'
          })
            .then(() => {
              return res.status(201).json({
                success: true,
                responseCode: ResponseCodes.property_preference_updated,
                data: savedPropertyPreference
              })
            })
            .catch(err => {
              return next(err)
            })
        })
      })
    }
  )
}
