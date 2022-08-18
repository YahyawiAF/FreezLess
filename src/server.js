import express from 'express'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import { connect } from './utils/db'
import { token } from './utils/authorization'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'
import selectsListsRouter from './resources/selectsLists/selectsLists.router'
import propertyRouter from './resources/property/property.router'
import propertyPreferenceRouter from './resources/propertyPreference/propertyPreference.router'
import meetingRouter from './resources/meeting/meeting.router'
import fileRouter from './resources/uploadedFile/uploadedFile.router'
import { ResponseCodes } from './utils/responseCodes'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(token)

setTimeout(() => {}, 1000)

// Routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/selectslists', selectsListsRouter)
app.use('/api/property', propertyRouter)
app.use('/api/propertypreference', propertyPreferenceRouter)
app.use('/api/meeting', meetingRouter)
app.use('/api/file', fileRouter)

// 404
app.use(function(req, res, next) {
  return res.status(404).json({ message: 'Route ' + req.url + ' Not found.' })
})

// 500 - Any server error
app.use(function(err, req, res, next) {
  return res.status(500).json({
    success: false,
    code: ResponseCodes.server_error,
    error: {
      message: err.message,
      stack: err.stack
    }
  })
})

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
