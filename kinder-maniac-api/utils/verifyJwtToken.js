const jwt = require('jsonwebtoken')
const { JWT_RESET_PASSWORD_SECRET, JWT_SECRET_LOGIN } = require('../config')
const { JWT_TOKEN_TYPE_RESET_PASSWORD } = require('../constants/jwtConfig')

const verifyJwtToken = (token, type) => {
  try {
    let secret
    switch (type) {
      case JWT_TOKEN_TYPE_RESET_PASSWORD:
        secret = JWT_RESET_PASSWORD_SECRET
        break
      default:
        secret = JWT_SECRET_LOGIN
        break
    }
    return jwt.verify(token, secret)
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

module.exports = verifyJwtToken
