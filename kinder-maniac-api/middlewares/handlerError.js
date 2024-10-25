const { default: mongoose } = require('mongoose')
const { serverError, PAGE_NOT_FOUND } = require('../constants/errorMessage')
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../constants/statusCodes')

const handlerError = (err, req, res, next) => {
  const {
    statusCode = (err instanceof mongoose.Error)
      ? BAD_REQUEST
      : INTERNAL_SERVER_ERROR,
    message,
  } = err
  const errorMessage = (message === '' && statusCode === NOT_FOUND)
    ? PAGE_NOT_FOUND
    : message

  res
    .status(statusCode)
    .send({
      statusCode,
      message: statusCode === INTERNAL_SERVER_ERROR
        ? `${INTERNAL_SERVER_ERROR} ${serverError}`
        : errorMessage,
    })
  next()
}

module.exports = handlerError
