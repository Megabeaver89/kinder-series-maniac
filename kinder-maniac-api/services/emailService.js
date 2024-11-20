const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_PASS } = require('../config')
const { REGISTRATION_SUCCESS, PASSWORD_CHANGED_SUCCESS, PASSWORD_RESET_REQUEST } = require('../constants/emailMessage')

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
  debug: true,
})

const sendEmail = async (userEmail, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `<${EMAIL}>`,
      to: `${userEmail}`,
      subject,
      text,
      html,
    })
    console.log("Сообщение отправлено: %s", info.messageId)
    console.log("Предварительный просмотр URL: %s", nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error("Ошибка при отправке письма:", error)
  }
}

const sendEmailRegistrationSuccess = async (userEmail) => {
  await sendEmail(
    userEmail,
    REGISTRATION_SUCCESS.subject,
    REGISTRATION_SUCCESS.text,
    REGISTRATION_SUCCESS.html,
  )
}

const sendEmailPasswordChangedSuccess = async (userEmail) => {
  await sendEmail(
    userEmail,
    PASSWORD_CHANGED_SUCCESS.subject,
    PASSWORD_CHANGED_SUCCESS.text,
    PASSWORD_CHANGED_SUCCESS.html,
  )
}

const sendEmailPassswordReset = async (userEmail, link) => {
  await sendEmail(
    userEmail,
    PASSWORD_RESET_REQUEST.subject,
    `${PASSWORD_RESET_REQUEST.text} ${link}`,
    PASSWORD_RESET_REQUEST.html,
  )
}
module.exports = {
  sendEmailRegistrationSuccess,
  sendEmailPasswordChangedSuccess,
  sendEmailPassswordReset,
}
