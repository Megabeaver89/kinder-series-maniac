const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const ExistingEmailError = require('../errors/ExistingEmailError')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const {
  OK,
  CREATED,
} = require('../constants/statusCodes')
const {
  PASSWORD_REQUIRED,
  EXISTING_EMAIL,
  AUTHORIZATION_REQUIRED,
  USER_NOT_FOUND,
} = require('../constants/errorMessage')
const { MONGO_DUPLICATE_KEY_ERROR_CODE } = require('../constants/errorCodes')
const { JWT_SECRET } = require('../config')
const { USER_LOGGED_OUT_SUCCESS } = require('../constants/message')
const { JWT_COOKIE_MAX_AGE, JWT_COOKIE_NAME, JWT_EXPIRATION } = require('../constants/cookieConfig')

const createUser = (req, res, next) => {
  const { nickname, email, password } = req.body
  if (!password) {
    return next(new BadRequestError(PASSWORD_REQUIRED))
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
            return next(new ExistingEmailError(EXISTING_EMAIL))
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
        { expiresIn: JWT_EXPIRATION },
      )
      res.cookie(JWT_COOKIE_NAME, token, {
        maxAge: JWT_COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token })
    })
    .catch(next)
}

const signoutUser = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError(AUTHORIZATION_REQUIRED))
  }
  try {
    res.clearCookie(JWT_COOKIE_NAME)
      .send({ message: USER_LOGGED_OUT_SUCCESS })
  } catch (err) {
    next(err)
  }
}

const returnEmailAndNameUser = (userData) => {
  const { name, email } = userData
  return { name, email }
}

const getUserInfo = (req, res, next) => {
  const userId = req.iser._id
  userModel.findById(userId)
    .orFail(() => next(new NotFoundError(USER_NOT_FOUND)))
    .then((user) => res.status(OK).send(returnEmailAndNameUser(user)))
    .catch(next)
}
