import { ResponseCodes } from '../../utils/responseCodes'
import { User } from '../user/user.model'
import { Meeting } from './meeting.model'
import {
  checkAvailability,
  deduceAvailability,
  getAvailabilitiesSteps
} from './meeting.service'
import { Property } from '../property/property.model'
import moment from '../../utils/moment'

export const getPropertyMeetings = (req, res, next) => {
  let property = req.body.property
  Meeting.find({ buyer: req.user.id, property: property }, (err, meetings) => {
    if (err) return next(err)
    if (!meetings) {
      return res.status(200).json({
        success: false,
        responseCode: ResponseCodes.no_meetings
      })
    }
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: { meetings: meetings }
    })
  })
}

export const getAvailabilities = (req, res, next) => {
  let meeting = req.body.meeting
  let property = req.body.property
  if (meeting) {
    let proposedBy = meeting.getLastDate()
      ? meeting.getLastDate().proposedBy
      : undefined
    User.findById(proposedBy, (err, user) => {
      if (err) return next(err)
      if (!user) {
        return res.status(404).json({
          success: false,
          responseCode: ResponseCodes.no_user_found
        })
      }
      let availabilities = getAvailabilitiesSteps(user.availabilities)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: { availabilities: availabilities }
      })
    })
  } else {
    User.findById(property.user, (err, user) => {
      if (err) return next(err)
      if (!user) {
        return res.status(404).json({
          success: false,
          responseCode: ResponseCodes.no_user_found
        })
      }
      let availabilities = getAvailabilitiesSteps(user.availabilities)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: { availabilities: availabilities }
      })
    })
  }
}

export const proposeMeeting = (req, res, next) => {
  let date = req.body.date
  let type = req.body.type
  let buyer = req.user
  let property = req.body.property
  Property.populate(property, { path: 'user' })
    .then(() => {
      Meeting.findOne(
        { buyer: buyer.id, property: property },
        (err, meeting) => {
          if (err) return next(err)
          if (!meeting) {
            meeting = new Meeting()
          }
          User.findById(property.user.id, (err, seller) => {
            if (err) return next(err)
            if (!seller) {
              return res.status(404).json({
                success: false,
                responseCode: ResponseCodes.no_user_found
              })
            }
            if (!checkAvailability(date, seller.availabilities)) {
              return res.status(404).json({
                success: false,
                responseCode: ResponseCodes.no_availability
              })
            }
            seller.availabilities = []
            deduceAvailability(date, seller.availabilities).map(
              availability => {
                console.log(availability)
                seller.availabilities.push({
                  start: availability.start,
                  end: availability.end
                })
              }
            )
            buyer.availabilities = []
            deduceAvailability(date, buyer.availabilities).map(availability => {
              buyer.availabilities.push({
                start: availability.start,
                end: availability.end
              })
            })
            seller.save((err, savedSeller) => {
              if (err) return next(err)
              buyer.save((err, buyerSeller) => {
                if (err) return next(err)
                meeting.buyer = buyer
                meeting.property = property
                meeting.addDate(date, type, req.user.id, property.user)
                meeting.save((err, createdMeeting) => {
                  if (err) return next(err)
                  return res.status(200).json({
                    success: true,
                    responseCode: ResponseCodes.meeting_created,
                    data: createdMeeting
                  })
                })
              })
            })
          })
        }
      )
    })
    .catch(err => {
      return next(err)
    })
}

export const respondMeeting = (req, res, next) => {
  let meeting = req.body.meeting
  let response = req.body.response
  let date = req.body.date
  Meeting.populate(meeting, {
    path: 'dates.proposedBy dates.waitingFor'
  })
    .then(() => {
      switch (response) {
        case 'accept':
          meeting.accept()
          break
        case 'refuse':
          meeting.refuse()
          break
        case 'report':
          if (
            !checkAvailability(
              date,
              meeting.getLastDate().proposedBy.availabilities
            )
          ) {
            return res.status(404).json({
              success: false,
              responseCode: ResponseCodes.no_availability
            })
          }
          meeting.getLastDate().waitingFor.availabilities = deduceAvailability(
            date,
            meeting.getLastDate().waitingFor.availabilities
          )
          meeting.getLastDate().proposedBy.availabilities = deduceAvailability(
            date,
            meeting.getLastDate().proposedBy.availabilities
          )
          meeting.getLastDate().proposedBy.save((err, savedProposedBy) => {
            if (err) return next(err)
            meeting.getLastDate().waitingFor.save((err, buyerWaitingFor) => {
              if (err) return next(err)
              meeting.report(date)
            })
          })
          break
      }
      meeting.save((err, updatedMeeting) => {
        if (err) return next(err)
        return res.status(200).json({
          success: true,
          responseCode: ResponseCodes.meeting_updated,
          data: updatedMeeting
        })
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const respondAfterMeeting = (req, res, next) => {
  let meeting = req.body.meeting
  if (moment(meeting.getLastDate().date).isAfter()) {
    return res.status(400).json({
      success: true,
      responseCode: ResponseCodes.visit_not_done_yet
    })
  }
  let response = req.body.response
  switch (response) {
    case 'refuse':
      meeting.refuse()
      break
    case 'needReflexion':
      meeting.doNeedReflexion()
      break
    case 'interested':
      meeting.isInterested()
      break
  }
  meeting.save((err, updatedMeeting) => {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.meeting_updated,
      data: updatedMeeting
    })
  })
}

export const makeOffer = (req, res, next) => {
  let meeting = req.body.meeting
  let offer = req.body.offer
  meeting.offer = req.body.offer
  if (moment(meeting.getLastDate().date).isAfter()) {
    return res.status(400).json({
      success: true,
      responseCode: ResponseCodes.visit_not_done_yet
    })
  }
  meeting.offerMade = true
  meeting.save((err, updatedMeeting) => {
    if (err) return next(err)
    offer.fileName =
      meeting.property.name +
      '_offer_' +
      meeting.buyer.firstName +
      '_' +
      meeting.buyer.lastName
    offer.save((err, updatedOffer) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.meeting_updated,
        data: updatedMeeting
      })
    })
  })
}

export const respondToOffer = (req, res, next) => {
  let meeting = req.body.meeting
  if (moment(meeting.getLastDate().date).isAfter()) {
    return res.status(400).json({
      success: true,
      responseCode: ResponseCodes.visit_not_done_yet
    })
  }
  if (meeting.offerMade) {
    return res.status(400).json({
      success: true,
      responseCode: ResponseCodes.offer_not_made_yet
    })
  }
  let response = req.body.response
  switch (response) {
    case 'refuse':
      meeting.offerRefused = false
      break
    case 'accept':
      meeting.offerAccepted = false
      break
  }
  meeting.save((err, updatedMeeting) => {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.meeting_updated,
      data: updatedMeeting
    })
  })
}

export const getAllMeetings = (req, res, next) => {
  Meeting.find({}, function(err, meetings) {
    if (err) return next(err)
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: meetings
    })
  })
    .populate({
      path: 'property',
      populate: { path: 'user' }
    })
}

export const deleteMeeting = (req, res, next) => {
  let meetingId = req.body.id
  Meeting.findById(meetingId, function(err, meeting) {
    if (err) return next(err)
    meeting.deletedAt = moment()
    meeting.save((err, savedMeeting) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.meetingDeleted
      })
    })
  })
}
