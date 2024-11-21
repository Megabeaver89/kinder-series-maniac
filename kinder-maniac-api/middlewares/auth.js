const jwt = require('jsonwebtoken')
const { JWT_SECRET_LOGIN } = require('../config')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { AUTHORIZATION_REQUIRED } = require('../constants/errorMessage')
const { getTokenformHeaders } = require('../utils/jwtUtils')

const auth = (req, res, next) => {
  const token = getTokenformHeaders(req.headers)
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
