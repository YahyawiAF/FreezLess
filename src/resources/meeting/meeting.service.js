import moment from '../../utils/moment'

export const getAvailabilitiesSteps = userAvailabilities => {
  let availabilities = {}
  for (let i = 0; i < userAvailabilities.length; i++) {
    if (!moment.isRange(userAvailabilities[i])) {
      userAvailabilities[i] = moment.range(
        userAvailabilities[i].start,
        userAvailabilities[i].end
      )
    }
    let availRange = userAvailabilities[i].clone()
    let day = moment(availRange.start)
      .startOf('day')
      .toISOString()
    availRange.end.subtract({ hours: 1 })
    if (!(day in availabilities)) {
      availabilities[day] = []
    }
    let timeArray = Array.from(availRange.by('minute', { step: 30 }))
    availabilities[day] = mergeArrays(availabilities[day], timeArray)
    availabilities[day].sort(function(a, b) {
      return a - b
    })
  }
  for (let availability in availabilities) {
    availabilities[availability] = availabilities[availability].map(t =>
      t.toDate()
    )
  }
  return availabilities
}

export const mergeArrays = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.reduce((newArray, item) => {
    if (newArray.includes(item)) {
      return newArray
    } else {
      return [...newArray, item]
    }
  }, [])
  return uniqueArray
}

export const checkAvailability = (date, availabilities) => {
  let startMeeting = moment(date)
  let endMeeting = moment(date).add(60, 'minutes')
  if (availabilities) {
    for (let i = 0; i < availabilities.length; i++) {
      availabilities[i] = moment.range(
        availabilities[i].start,
        availabilities[i].end
      )
      if (
        availabilities[i].contains(startMeeting) &&
        availabilities[i].contains(endMeeting)
      ) {
        return true
      }
    }
  }
  return false
}

export const deduceAvailability = (date, availabilities) => {
  let startMeeting = moment(date)
  let endMeeting = moment(date).add(60, 'minutes')
  let fullMeetingRange = moment.range(
    startMeeting.clone().subtract(30, 'minutes'),
    endMeeting.clone().add(30, 'minutes')
  )
  let i = 0
  let foundMatch = false
  while (availabilities && i < availabilities.length && !foundMatch) {
    let availability = moment.range(
      availabilities[i].start,
      availabilities[i].end
    )
    if (
      availability.contains(startMeeting) &&
      availability.contains(endMeeting)
    ) {
      let updatedAvailabilities = availability.subtract(fullMeetingRange)
      foundMatch = true
      availabilities.splice(i, 1)
      if (updatedAvailabilities && updatedAvailabilities.length > 0) {
        availabilities = addAvailability(availabilities, updatedAvailabilities)
      }
    }
    i++
  }
  return availabilities
}

export const addAvailability = (
  availabilitiesRanges,
  updatedAvailabilitiesRanges
) => {
  if (moment.isRange(updatedAvailabilitiesRanges)) {
    updatedAvailabilitiesRanges = [].push(updatedAvailabilitiesRanges)
  }
  return removeRedundancyAvailability(
    availabilitiesRanges.concat(updatedAvailabilitiesRanges)
  )
}

export const removeRedundancyAvailability = availabilities => {
  let formattedAvailabilities = []
  for (let i = 0; i < availabilities.length; i++) {
    let availability = moment.range(
      availabilities[i].start,
      availabilities[i].end
    )
    let j = 0
    let foundMatch = false
    while (j < formattedAvailabilities.length && !foundMatch) {
      let newRange = moment.range(
        formattedAvailabilities[j].start,
        formattedAvailabilities[j].end
      )
      let matchedRange = newRange.add(availability, {
        adjacent: true
      })
      if (matchedRange) {
        formattedAvailabilities.splice(j, 1)
        formattedAvailabilities.push(
          moment.range(matchedRange.start, matchedRange.end)
        )
        foundMatch = true
      }
      j++
    }
    if (!foundMatch) {
      formattedAvailabilities.push(
        moment.range(availability.start, availability.end)
      )
    }
  }
  return formattedAvailabilities
}
