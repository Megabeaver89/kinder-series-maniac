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
  NEW_NICKNAME_SAME_OLD,
  PASSWORDS_NOT_THE_SAME,
  PASSWORDS_MUST_BE_NOT_EMPTY,
  PASSWORDS_SIMILAR,
} = require('../constants/errorMessage')
const { MONGO_DUPLICATE_KEY_ERROR_CODE } = require('../constants/errorCodesDataBase')
const { JWT_SECRET } = require('../config')
const { USER_LOGGED_OUT_SUCCESS, USER_DELETED_SUCCESS, PASSWORD_CHANGED_SUCCESS } = require('../constants/message')
const { JWT_COOKIE_MAX_AGE, JWT_COOKIE_NAME, JWT_EXPIRATION } = require('../constants/cookieConfig')
const NoChangesError = require('../errors/NoChangesError')

const createUser = (req, res, next) => {
  const { nickname, email, password } = req.body

  if (!password) {
    return next(new BadRequestError(PASSWORD_REQUIRED))
  }

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      nickname,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.status(CREATED).send({
        _id: newUser._id,
        nickname: newUser.nickname,
        email: newUser.email,
      })
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
        return next(new ExistingEmailError(EXISTING_EMAIL))
      }
      next(err)
    })
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
        secure: true,
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

const returnEmailAndNicknameUser = (userData) => {
  const { nickname, email } = userData
  return { nickname, email }
}

const getUserInfo = (req, res, next) => {
  const userId = req.user._id
  userModel.findById(userId)
    .orFail(() => next(new NotFoundError(USER_NOT_FOUND)))
    .then((user) => res.status(OK).send(returnEmailAndNicknameUser(user)))
    .catch(next)
}

const updateUser = (req, res, next, data) => {
  const updateObject = { ...data }

  userModel.findOne({ email: updateObject.email })
    .then((existingUser) => {
      if (existingUser) {
        if (existingUser.id !== req.user._id) {
          return next(new ExistingEmailError(EXISTING_EMAIL))
        }
        if (
          existingUser.email === updateObject.email
          && existingUser.nickname === updateObject.nickname
        ) {
          return next(new NoChangesError(NEW_NICKNAME_SAME_OLD))
        }
      }

      return userModel.findByIdAndUpdate(
        req.user._id,
        updateObject,
        { new: true, runValidators: true },
      )
        .orFail(() => next(new NotFoundError(USER_NOT_FOUND)))
        .then((user) => res.status(OK).send(returnEmailAndNicknameUser(user)))
        .catch(next)
    })
    .catch(next)
}

const editUserInfo = (req, res, next) => {
  const { nickname, email } = req.body
  updateUser(req, res, next, { nickname, email })
}

const deleteUser = (req, res, next) => {
  const userId = req.user._id
  userModel.findByIdAndDelete(userId)
    .orFail(() => new NotFoundError(USER_NOT_FOUND))
    .then((userDeleted) => res.status(OK)
      .send({
        user: returnEmailAndNicknameUser(userDeleted),
        message: USER_DELETED_SUCCESS,
      }))
    .catch(next)
}

const editUserPassword = (req, res, next) => {
  const { newPassword, passwordRepeat } = req.body
  if (!newPassword || !passwordRepeat) {
    return next(new BadRequestError(PASSWORDS_MUST_BE_NOT_EMPTY))
  }
  if (newPassword !== passwordRepeat) {
    return next(new BadRequestError(PASSWORDS_NOT_THE_SAME))
  }

  userModel.findById(req.user._id).select('+password')
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(USER_NOT_FOUND))
      }
      return bcrypt.compare(newPassword, user.password)
        .then((matched) => {
          if (matched) {
            return next(new BadRequestError(PASSWORDS_SIMILAR))
          }
          return bcrypt.hash(newPassword, 10)
        })
    })

    .then((hash) => userModel.findByIdAndUpdate(
      req.user._id,
      { password: hash },
      { new: true, runValidators: true },
    ))
    .then(() => res.status(OK).send({
      message: PASSWORD_CHANGED_SUCCESS,
    }))
    .catch(next)
}

module.exports = {
  getUserInfo,
  createUser,
  editUserInfo,
  loginUser,
  signoutUser,
  deleteUser,
  editUserPassword,
}
