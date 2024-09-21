const { default: mongoose } = require('mongoose')
const { serverError } = require('../constants/errorMessage')
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes')

const handlerError = (err, req, res, next) => {
  const {
    statusCode = (err instanceof mongoose.Error)
      ? BAD_REQUEST
      : INTERNAL_SERVER_ERROR,
    message,
  } = err

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? `${INTERNAL_SERVER_ERROR} ${serverError}`
        : message,
    })
  next()
}

module.exports = handlerError
