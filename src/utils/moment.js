import Moment from 'moment-timezone'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

moment.tz.setDefault('Europe/Paris')

export default moment
