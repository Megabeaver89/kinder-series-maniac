const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const ExistingEmailError = require('../errors/ExistingEmailError')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const { passwordRequired, existingEmail } = require('../constants/errorMessage')
const { CREATED } = require('../constants/statusCodes')
const { MONGO_DUPLICATE_KEY_ERROR_CODE } = require('../constants/errorCodes')
const { JWT_SECRET } = require('../config')

const createUser = (req, res, next) => {
  const { nickname, email, password } = req.body
  if (!password) {
    return next(new BadRequestError(passwordRequired))
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        nickname,
        email,
        password: hash,
      })
        .then((newUser) => res.status(CREATED).send({
          _id: newUser._id,
          nickname: newUser.nickname,
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

const loginUser = (req, res, next) => {
  const { email, password } = req.body
  userModel.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '3d' },
      )
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 3,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token })
    })
    .catch(next)
}
