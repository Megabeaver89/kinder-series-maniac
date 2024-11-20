const jwt = require('jsonwebtoken')
const { JWT_SECRET_LOGIN, JWT_SECRET_RESET_PASSWORD } = require('../config')
const { JWT_EXPIRATION_THREE_DAYS, JWT_EXPIRATION_ONE_HOUR, JWT_TOKEN_TYPE_LOGIN } = require('../constants/jwtConfig')
const { JWT_TOKEN_TYPE_RESET_PASSWORD } = require('../constants/jwtConfig')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { INVALID_TOKEN, TOKEN_EXPIRED, ERROR_TOKEN_CHECK } = require('../constants/errorMessage')

const getJwtSecret = (type) => {
  switch (type) {
    case JWT_TOKEN_TYPE_RESET_PASSWORD:
      return {
        secret: JWT_SECRET_RESET_PASSWORD,
        expiresIn: JWT_EXPIRATION_ONE_HOUR,
      }
    default:
      return {
        secret: JWT_SECRET_LOGIN,
        expiresIn: JWT_EXPIRATION_THREE_DAYS,
      }
  }
}

const verifyJwtToken = (token, type) => {
  try {
    const { secret } = getJwtSecret(type)
    return jwt.verify(token, secret)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError(TOKEN_EXPIRED)
    }
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError(INVALID_TOKEN)
    }
    throw new UnauthorizedError(ERROR_TOKEN_CHECK)
  }
}

const generateJwtToken = (userIdentifier, type = JWT_TOKEN_TYPE_LOGIN) => {
  const { secret, expiresIn } = getJwtSecret(type)
  const payload = type === JWT_TOKEN_TYPE_LOGIN
    ? { _id: userIdentifier }
    : { email: userIdentifier }
  return jwt.sign(payload, secret, { expiresIn })
}

module.exports = {
  generateJwtToken,
  verifyJwtToken,
}
