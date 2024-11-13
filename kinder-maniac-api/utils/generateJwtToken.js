const jwt = require('jsonwebtoken')
const { JWT_SECRET_LOGIN, JWT_SECRET_RESET_PASSWORD } = require('../config')
const { JWT_EXPIRATION_MAX, JWT_EXPIRATION_MIN, JWT_TOKEN_TYPE_LOGIN } = require('../constants/jwtConfig')
const { JWT_TOKEN_TYPE_RESET_PASSWORD } = require('../constants/jwtConfig')

const getJwtSecret = (type) => {
  let secret
  switch (type) {
    case JWT_TOKEN_TYPE_RESET_PASSWORD:
      secret = JWT_SECRET_RESET_PASSWORD
      break
    default:
      secret = JWT_SECRET_LOGIN
      break
  }
  return secret
}

const verifyJwtToken = (token, type) => {
  try {
    const jwtSecret = getJwtSecret(type)
    return jwt.verify(token, jwtSecret)
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

const generateJwtToken = (userIdentifier, type = JWT_TOKEN_TYPE_LOGIN) => {
  const isLogin = type === JWT_TOKEN_TYPE_LOGIN
  const payload = isLogin ? { _id: userIdentifier } : { email: userIdentifier }
  const jwtSecret = getJwtSecret(type)
  const expiresIn = isLogin ? JWT_EXPIRATION_MAX : JWT_EXPIRATION_MIN
  return jwt.sign(payload, jwtSecret, { expiresIn })
}

module.exports = generateJwtToken
