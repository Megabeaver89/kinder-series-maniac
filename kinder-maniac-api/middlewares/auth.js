const jwt = require('jsonwebtoken')
const { JWT_SECRET_LOGIN } = require('../config')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { AUTHORIZATION_REQUIRED } = require('../constants/errorMessage')

const auth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(AUTHORIZATION_REQUIRED))
  }
  const token = authorization.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET_LOGIN)
  } catch (err) {
    return next(new UnauthorizedError(AUTHORIZATION_REQUIRED))
  }
  req.user = payload
  next()
}
module.exports = auth
