const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { authorizationRequired } = require('../constants/errorMessage')

const auth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(authorizationRequired))
  }
}
