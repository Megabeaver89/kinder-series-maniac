const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_PASS } = require('../config')

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
      from: `"Test Sender" <${EMAIL}>`, // Адрес отправителя
      to: `${userEmail}`, // Адрес получателя
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

module.exports = sendEmail
