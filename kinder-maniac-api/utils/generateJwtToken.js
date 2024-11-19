const jwt = require('jsonwebtoken')
const { JWT_SECRET_LOGIN, JWT_SECRET_RESET_PASSWORD } = require('../config')
const { JWT_EXPIRATION_MAX, JWT_EXPIRATION_MIN, JWT_TOKEN_TYPE_LOGIN } = require('../constants/jwtConfig')

const generateJwtToken = (userIdentifier, type = JWT_TOKEN_TYPE_LOGIN) => {
  const isLogin = type === JWT_TOKEN_TYPE_LOGIN
  const payload = isLogin ? { _id: userIdentifier } : { email: userIdentifier }
  const jwtSecret = isLogin ? JWT_SECRET_LOGIN : JWT_SECRET_RESET_PASSWORD
  const expiresIn = isLogin ? JWT_EXPIRATION_MAX : JWT_EXPIRATION_MIN
  return jwt.sign(payload, jwtSecret, { expiresIn })
}

module.exports = generateJwtToken
