import { MeetingStatus } from './meetingStatus.enum'
import moment from '../../utils/moment'
import { Meeting } from '../meeting/meeting.model'
import { Property } from './property.model'

export const addIsFavoriteToArray = (properties, favoritesProperties) => {
  properties.map(p => {
    addIsFavorite(p, favoritesProperties)
  })
}

export const addIsFavorite = (property, favoritesProperties) => {
  property.isFavorite = favoritesProperties.indexOf(property.id) > -1
}

export const addMeetingStatus = (property, meeting) => {
  if (!meeting) {
    property.meetingStatus = MeetingStatus.none
    return property
  }
  if (
    meeting.dates.some(date => date.reported === false) &&
    meeting.dates.some(date => date.refused === false) &&
    meeting.dates.some(date => date.accepted === false)
  ) {
    property.meetingStatus = MeetingStatus.proposed
  }
  if (meeting.dates.some(date => date.reported === true)) {
    property.meetingStatus = MeetingStatus.reported
  }
  if (meeting.dates.some(date => date.refused === true)) {
    property.meetingStatus = MeetingStatus.refused
  }
  if (meeting.dates.some(date => date.accepted === true)) {
    property.meetingStatus = MeetingStatus.accepted
  }
  if (
    meeting.dates.some(
      date => date.accepted === true && moment(date.date).isBefore() === true
    )
  ) {
    property.meetingStatus = MeetingStatus.supposedlyDone
  }
  return property
}

export const getVisitedPropertiesService = user => {
  return new Promise(function(resolve, reject) {
    Meeting.aggregate([
      {
        $match: {
          $and: [
            { buyer: user._id },
            {
              $expr: {
                $let: {
                  vars: { lastDate: { $arrayElemAt: ['$dates', -1] } },
                  in: {
                    $and: [
                      { $eq: ['$$lastDate.accepted', true] },
                      { $lte: ['$$lastDate.date', new Date()] }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ]).exec((err, meetings) => {
      if (err) reject(err)
      Meeting.populate(meetings, { path: 'property property.user' }, err => {
        if (err) reject(err)
        let properties = meetings.map(m => {
          let property = addMeetingStatus(m.property, m)
          property.visitDate = m.dates[m.dates.length - 1].date
          return property.getPropertyDetails()
        })
        resolve(properties)
      })
    })
  })
}

export const getPropertyDetailsByUser = (property, user) => {
  return new Promise((resolve, reject) =>
    Meeting.findOne(
      { buyer: user.id, property: property.id },
      (err, meeting) => {
        if (err) return reject(err)
        property = addMeetingStatus(property, meeting)
        return resolve(property.getPropertyDetails())
      }
    )
  )
}

export const getPropertiesWithUserPreferences = user => {
  return new Promise((resolve, reject) => {
    getVisitedPropertiesService(user)
      .then(visitedProperties => {
        Property.find({ _id: { $nin: user.properties } }, (err, properties) => {
          if (err) return reject(err)
          addIsFavoriteToArray(properties, user.favoritesProperties)
          properties.filter(property => {
            visitedProperties.some(
              visitedProperty => visitedProperty.id === property.id
            )
          })
          properties = properties.map(property => {
            return getPropertyDetailsByUser(property, user)
          })
          Promise.all(properties)
            .then(properties => {
              return resolve(properties)
            })
            .catch(err => {
              return reject(err)
            })
        })
      })
      .catch(err => {
        return reject(err)
      })
  })
}
