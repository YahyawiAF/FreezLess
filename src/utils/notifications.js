import * as admin from 'firebase-admin'

const serviceAccount = require('../config/fcmServiceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export const createNotification = (user, title, text, type, url) => {
  user.addNotification(title, text, type, url)
  return user.save((err, user) => {
    if (err) return Promise.reject(err)
    return Promise.resolve(user)
  })
}

export const sendNotificationToUser = user => {
  const registrationTokens = [user.fcmToken]
  let data = {
    tokens: registrationTokens,
    notification: {
      title: 'Test from server',
      body: 'Test from server message'
    },
    webpush: {
      headers: {
        Urgency: 'normal'
      },
      notification: {
        body: 'Web push test title',
        requireInteraction: 'false'
      }
    }
  }
  return admin
    .messaging()
    .sendMulticast(data)
    .then(response => {
      if (response.failureCount > 0) {
        const failedTokens = []
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx])
            return Promise.reject(resp)
          }
        })
        console.log('List of tokens that caused failures: ' + failedTokens)
      }
      console.log(response)
      return Promise.resolve(response)
    })
    .catch(error => {
      console.log(error)
      return Promise.reject(error)
    })
}
