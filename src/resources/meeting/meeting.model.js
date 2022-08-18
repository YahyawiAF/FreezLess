import mongoose from 'mongoose'
import moment from '../../utils/moment'
let ObjectId = mongoose.Schema.Types.ObjectId

const meetingSchema = new mongoose.Schema(
  {
    dates: [
      {
        accepted: {
          type: Boolean,
          default: false
        },
        refused: {
          type: Boolean,
          default: false
        },
        reported: {
          type: Boolean,
          default: false
        },
        date: {
          type: Date
        },
        type: {
          type: String,
          enum: ['call', 'visit']
        },
        proposedBy: {
          type: ObjectId,
          ref: 'User'
        },
        waitingFor: {
          type: ObjectId,
          ref: 'User'
        }
      }
    ],
    buyer: {
      type: ObjectId,
      ref: 'User'
    },
    property: {
      type: ObjectId,
      ref: 'Property'
    },
    refused: {
      type: Boolean,
      default: false
    },
    needReflexion: {
      type: Boolean,
      default: false
    },
    interested: {
      type: Boolean,
      default: false
    },
    offerMade: {
      type: Boolean,
      default: false
    },
    offer: {
      type: ObjectId,
      ref: 'UploadedFile'
    },
    offerRefused: {
      type: Boolean,
      default: false
    },
    offerAccepted: {
      type: Boolean,
      default: false
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

meetingSchema.pre('save', function(next) {
  this.updatedAt = moment()
  next()
})

meetingSchema.methods.toJSON = function() {
  let obj = this.toObject()
  if (this.propertyType) {
  }
  return obj
}

meetingSchema.methods.getLastDate = function() {
  let meeting = this
  return meeting.dates[meeting.dates.length - 1]
}

meetingSchema.methods.addDate = function(date, type, proposedBy, waitingFor) {
  let meeting = this
  meeting.dates.push({
    date: date,
    type: type,
    proposedBy: proposedBy,
    waitingFor: waitingFor
  })
}

meetingSchema.methods.accept = function() {
  let meeting = this
  let lastDate = meeting.getLastDate()
  if (lastDate) {
    lastDate.accepted = true
    lastDate.refused = false
    lastDate.reported = false
  }
}

meetingSchema.methods.refuse = function() {
  let meeting = this
  let lastDate = meeting.getLastDate()
  if (lastDate) {
    lastDate.accepted = false
    lastDate.refused = true
    lastDate.reported = false
  }
  meeting.refused = true
}

meetingSchema.methods.report = function(date) {
  let meeting = this
  let lastDate = meeting.getLastDate()
  if (lastDate) {
    lastDate.accepted = false
    lastDate.refused = false
    lastDate.reported = true
    meeting.addDate(
      date,
      lastDate.type,
      lastDate.waitingFor,
      lastDate.proposedBy
    )
  }
}

meetingSchema.methods.doNeedReflexion = function() {
  let meeting = this
  meeting.needReflexion = true
}

meetingSchema.methods.isInterested = function() {
  let meeting = this
  meeting.interested = true
}

export const Meeting = mongoose.model('Meeting', meetingSchema)
