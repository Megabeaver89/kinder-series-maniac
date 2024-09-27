const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const UnauthorizedError = require('../errors/UnauthorizedError')
const {
  NICKNAME_TEXT,
  EMAIL_TEXT,
  PASSWORD_TEXT } = require('../constants/userSchema')
const {
  MIN_LENGTH_FIELD,
  MAX_LENGTH_FIELD,
  LENGTH_TWO,
  LENGTH_THIRTY } = require('../constants/schema')
const { insertErrorText } = require('../helpers/insertErrorText')
const { INCORRECT_EMAIL, INCORRECT_LOGIN_OR_PASSWORD } = require('../constants/errorMessage')

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, mustBeFilled(NICKNAME_TEXT)],
    minlength: [2, insertErrorText(MIN_LENGTH_FIELD, NICKNAME_TEXT, LENGTH_TWO)],
    maxlength: [30, insertErrorText(MAX_LENGTH_FIELD, NICKNAME_TEXT, LENGTH_THIRTY)],
  },
  email: {
    type: String,
    required: [true, mustBeFilled(EMAIL_TEXT)],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: INCORRECT_EMAIL,
    },
  },
  password: {
    type: String,
    required: [true, mustBeFilled(PASSWORD_TEXT)],
  },
}, { versionKey: false })

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError(INCORRECT_LOGIN_OR_PASSWORD)))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError(INCORRECT_LOGIN_OR_PASSWORD))
        }
        return user
      }))
}

module.exports = mongoose.model('user', userSchema)
