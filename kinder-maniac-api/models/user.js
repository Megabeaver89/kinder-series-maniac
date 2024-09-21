const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { nicknameText, emailText, passwordText } = require('../constants/userSchema')
const { maxLengthField, minLengthField, lengthTwo, lengthThirty } = require('../constants/schema')
const { insertErrorText } = require('../helpers/insertErrorText')
const { incorrectEmail, incorreсtLoginOrPassword } = require('../constants/errorMessage')

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, mustBeFilled(nicknameText)],
    minlength: [2, insertErrorText(minLengthField, nicknameText, lengthTwo)],
    maxlength: [30, insertErrorText(maxLengthField, nicknameText, lengthThirty)],
  },
  email: {
    type: String,
    required: [true, mustBeFilled(emailText)],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: incorrectEmail,
    },
  },
  password: {
    type: String,
    required: [true, mustBeFilled(passwordText)],
  },
}, { versionKey: false })

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError(incorreсtLoginOrPassword)))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError(incorreсtLoginOrPassword))
        }
        return user
      }))
}

module.exports = mongoose.model('user', userSchema)
