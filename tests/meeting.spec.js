import {
  addAvailability,
  checkAvailability,
  deduceAvailability
} from '../src/resources/meeting/meeting.service'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const a = moment('2020-01-02T08:00:00.000Z')
const b = moment('2020-01-02T09:00:00.000Z')
const bb = moment('2020-01-02T09:30:00.000Z')
const c = moment('2020-01-02T10:00:00.000Z')
const d = moment('2020-01-02T11:00:00.000Z')
const e = moment('2020-01-02T11:30:00.000Z')
const f = moment('2020-01-02T12:00:00.000Z')
const g = moment('2020-01-02T12:30:00.000Z')
const h = moment('2020-01-02T13:00:00.000Z')
const i = moment('2020-01-02T14:00:00.000Z')
const j = moment('2020-01-02T15:00:00.000Z')
const k = moment('2020-01-02T16:00:00.000Z')
const range1 = moment.range(a, b)
const range2 = moment.range(b, e)
const range3 = moment.range(a, e)
const range4 = moment.range(bb, e)
const range5 = moment.range(j, k)

describe('CheckAvailability', () => {
  it('Should test that meeting date a exist in availability ranges 1 and 5', () => {
    expect(checkAvailability(a, [range1, range5])).toBe(true)
  })
  it("Should test that meeting date b doesn't exist in availability ranges 1 and 5", () => {
    expect(checkAvailability(b, [range1, range5])).toBe(false)
  })
  it("Should test that meeting date c doesn't exist in availability ranges 1 and 5", () => {
    expect(checkAvailability(c, [range1, range5])).toBe(false)
  })
  it('Should test that meeting date j exist in availability ranges 1 and 5', () => {
    expect(checkAvailability(j, [range1, range5])).toBe(true)
  })
  it("Should test that meeting date k doesn't exist in availability ranges 1 and 5", () => {
    expect(checkAvailability(k, [range1, range5])).toBe(false)
  })
})

describe('Deduce Availability', () => {
  it('Deduce meeting date j from range 1 and 5', () => {
    expect(deduceAvailability(j, [range1, range5])).toMatchObject([range1])
  })
})

describe('Add Availability', () => {
  it('Add range 1 and 2 and 5 to range 3', () => {
    expect(addAvailability([range3], [range1, range2, range5])).toMatchObject([
      range3,
      range5
    ])
  })
})
