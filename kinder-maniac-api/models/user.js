const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { nickName, name, surname, email, password } = require('../constants/userSchema')
const { maxLengthField, minLengthField, lengthTwo, lengthThirty } = require('../constants/schema')
const { insertErrorText } = require('../helpers/insertErrorText')
const { incorrectEmail, incorrextLoginOrPassword } = require('../constants/errorMessage')

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: [true, mustBeFilled(nickName)],
    minlength: [2, insertErrorText(minLengthField, nickName, lengthTwo)],
    maxlength: [30, insertErrorText(maxLengthField, nickName, lengthThirty)],
  },
  name: {
    type: String,
    required: [true, mustBeFilled(name)],
    minlength: [2, insertErrorText(minLengthField, name, lengthTwo)],
    maxlength: [30, insertErrorText(maxLengthField, nickName, lengthThirty)],
  },
  surname: {
    type: String,
    required: [true, mustBeFilled(surname)],
    minlength: [2, insertErrorText(minLengthField, surname, lengthTwo)],
    maxlength: [30, insertErrorText(maxLengthField, nickName, lengthThirty)],
  },
  email: {
    type: String,
    required: [true, mustBeFilled(email)],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: incorrectEmail,
    },
  },
  password: {
    type: String,
    required: [true, mustBeFilled(password)],
  },
}, { versionKey: false })
//****************************** */
userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError(incorrextLoginOrPassword)))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError(incorrextLoginOrPassword))
        }
        return user
      }))
}

module.exports = mongoose.model('user', userSchema)
