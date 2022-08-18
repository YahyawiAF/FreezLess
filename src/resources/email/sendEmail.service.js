const Email = require('email-templates')
const path = require('path')
const nodemailer = require('nodemailer')

export function sendEmail(user, emailType, language = 'fr', data = {}) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  })
  const email = new Email({
    message: {
      from: process.env.MAIL_SENDER
    },
    send: process.env.MAIL_SEND_DEV_ENV === 'true',
    transport: transporter,
    views: {
      root: path.join(__dirname, 'emails', language)
    }
  })

  return email.send({
    template: emailType,
    message: {
      to: user.email
    },
    locals: {
      user: user,
      subject: emailType,
      data: data
    }
  })
}
