const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const ExistingEmailError = require('../errors/ExistingEmailError')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { passwordRequired, existingEmail } = require('../constants/errorMessage')
const { CREATED } = require('../constants/statusCodes')
const { MONGO_DUPLICATE_KEY_ERROR_CODE } = require('../constants/errorCodes')

const createUser = (req, res, next) => {
  const { nickName, email, password } = req.body
  if (!password) {
    return next(new BadRequestError(passwordRequired))
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        nickName,
        email,
        password: hash,
      })
        .then((newUser) => res.status(CREATED).send({
          _id: newUser._id,
          nickName: newUser.nickName,
          email: newUser.email,
        }))
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
            return next(new ExistingEmailError(existingEmail))
          }
        })
    })
    .catch(next)
}
