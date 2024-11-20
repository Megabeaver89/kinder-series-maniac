const dotenv = require('dotenv')

dotenv.config()

const nodeEnvIsProduction = process.env.NODE_ENV === 'production'

const PORT = nodeEnvIsProduction ? process.env.PORT : 3000
const JWT_SECRET_LOGIN = nodeEnvIsProduction ? process.env.JWT_SECRET_LOGIN : 'long-key-word'
const JWT_SECRET_RESET_PASSWORD = nodeEnvIsProduction ? process.env.JWT_SECRET_RESET_PASSWORD : 'very-long-key-word'
const DB_ADDRESS = nodeEnvIsProduction ? process.env.DB_ADDRESS : 'mongodb://127.0.0.1:27017/kindermaniacdb'
const EMAIL = nodeEnvIsProduction ? process.env.EMAIL : 'oscar.hodkiewicz@ethereal.email'
const EMAIL_PASS = nodeEnvIsProduction ? process.env.EMAIL_PASS : 'PSExJTDwykdJj7WU4u'

module.exports = {
  PORT,
  JWT_SECRET_LOGIN,
  JWT_SECRET_RESET_PASSWORD,
  DB_ADDRESS,
  EMAIL,
  EMAIL_PASS,
}
