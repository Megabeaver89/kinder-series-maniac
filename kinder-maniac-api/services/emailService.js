const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_PASS } = require('../config')
const { REGISTRATION_SUCCESS, PASSWORD_CHANGED_SUCCESS, PASSWORD_RESET_REQUEST } = require('../constants/emailMessage')
const generateEmailHtml = require('../utils/generateEmailHtml')

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

const sendEmailRegistrationSuccess = async (userEmail, link) => {
  const emailHtml = generateEmailHtml(
    REGISTRATION_SUCCESS.subject,
    REGISTRATION_SUCCESS.body,
    REGISTRATION_SUCCESS.buttonText,
    `${link}`,
    REGISTRATION_SUCCESS.color,
  )
  await sendEmail(
    userEmail,
    REGISTRATION_SUCCESS.subject,
    REGISTRATION_SUCCESS.text,
    emailHtml,
  )
}

const sendEmailPasswordChangedSuccess = async (userEmail) => {
  const emailHtml = generateEmailHtml(
    PASSWORD_CHANGED_SUCCESS.subject,
    PASSWORD_CHANGED_SUCCESS.body,
    null,
    null,
    PASSWORD_CHANGED_SUCCESS.color,
  )
  await sendEmail(
    userEmail,
    PASSWORD_CHANGED_SUCCESS.subject,
    PASSWORD_CHANGED_SUCCESS.text,
    emailHtml,
  )
}

const sendEmailPassswordReset = async (userEmail, link) => {
  const emailHtml = generateEmailHtml(
    PASSWORD_RESET_REQUEST.subject,
    PASSWORD_RESET_REQUEST.body,
    PASSWORD_RESET_REQUEST.buttonText,
    `${link}`,
    PASSWORD_RESET_REQUEST.color,
  )
  await sendEmail(
    userEmail,
    PASSWORD_RESET_REQUEST.subject,
    PASSWORD_RESET_REQUEST.text,
    emailHtml,
  )
}
module.exports = {
  sendEmailRegistrationSuccess,
  sendEmailPasswordChangedSuccess,
  sendEmailPassswordReset,
}
