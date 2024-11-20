const bcrypt = require('bcryptjs')
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
  INVALID_TOKEN,
  TOKEN_EXPIRED,
} = require('../constants/errorMessage')
const { MONGO_DUPLICATE_KEY_ERROR_CODE } = require('../constants/errorCodesDataBase')
const { USER_LOGGED_OUT_SUCCESS, USER_DELETED_SUCCESS, PASSWORD_CHANGED_SUCCESS, RESET_LINK_TO_EMAIL } = require('../constants/message')
const { JWT_COOKIE_MAX_AGE, JWT_COOKIE_NAME } = require('../constants/cookieConfig')
const NoChangesError = require('../errors/NoChangesError')
const { sendEmailRegistrationSuccess, sendEmailPasswordChangedSuccess, sendEmailPassswordReset } = require('../services/emailService')
const { hashPassword } = require('../utils/passwordUtils')
const { generateJwtToken, verifyJwtToken } = require('../utils/jwtUtils')
const { JWT_TOKEN_TYPE_RESET_PASSWORD } = require('../constants/jwtConfig')
const ForbiddenError = require('../errors/ForBiddenError')

const createUser = async (req, res, next) => {
  const { nickname, email, password } = req.body
  try {
    if (!password) {
      return next(new BadRequestError(PASSWORD_REQUIRED))
    }
    const hash = await hashPassword(password)
    const newUser = await userModel.create({
      nickname,
      email,
      password: hash,
    })
    await sendEmailRegistrationSuccess(email)
    res.status(CREATED).send({
      _id: newUser._id,
      nickname: newUser.nickname,
      email: newUser.email,
    })
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
      return next(new ExistingEmailError(EXISTING_EMAIL))
    }
    next(err)
  }
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findUserByCredentials(email, password, next)
    const token = generateJwtToken(user._id)
    res.cookie(JWT_COOKIE_NAME, token, {
      maxAge: JWT_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
    res.send({ token })
  } catch (err) {
    next(err)
  }
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

const getUserInfo = async (req, res, next) => {
  const userId = req.user._id
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND))
    }
    res.status(OK).send(returnEmailAndNicknameUser(user))
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next, data) => {
  const updateObject = { ...data }
  try {
    const existingUser = await userModel.findOne({ email: updateObject.email })
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

    const updatingUser = await userModel.findByIdAndUpdate(
      req.user._id,
      updateObject,
      { new: true, runValidators: true },
    )
    if (!updatingUser) {
      return next(new NotFoundError(USER_NOT_FOUND))
    }
    res.status(OK).send(returnEmailAndNicknameUser(updatingUser))
  } catch (err) {
    next(err)
  }
}

const editUserInfo = async (req, res, next) => {
  const { nickname, email } = req.body
  await updateUser(req, res, next, { nickname, email })
}

const deleteUser = async (req, res, next) => {
  const userId = req.user._id
  try {
    const deletingUser = await userModel.findByIdAndDelete(userId)
    if (!deletingUser) {
      return next(new NotFoundError(USER_NOT_FOUND))
    }
    res.status(OK)
      .send({
        user: returnEmailAndNicknameUser(deletingUser),
        message: USER_DELETED_SUCCESS,
      })
  } catch (err) {
    next(err)
  }
}

const updatePassword = async (userId, newPassword) => {
  const hash = await hashPassword(newPassword)
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { password: hash },
    { new: true, runValidators: true },
  )
  if (!updatedUser) {
    throw new NotFoundError(USER_NOT_FOUND)
  }
  return updateUser
}

const checkPasswords = (newPassword, passwordRepeat) => {
  if (!newPassword || !passwordRepeat) {
    throw new BadRequestError(PASSWORDS_MUST_BE_NOT_EMPTY)
  }
  if (newPassword !== passwordRepeat) {
    throw new BadRequestError(PASSWORDS_NOT_THE_SAME)
  }
}

const editUserPassword = async (req, res, next) => {
  const { newPassword, passwordRepeat } = req.body
  try {
    checkPasswords(newPassword, passwordRepeat)

    const user = await userModel.findById(req.user._id).select('+password')
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND))
    }
    const isMatch = await bcrypt.compare(newPassword, user.password)
    if (isMatch) {
      return next(new BadRequestError(PASSWORDS_SIMILAR))
    }

    const updatedUser = await updatePassword(req.user._id, newPassword)

    await sendEmailPasswordChangedSuccess(updatedUser.email)
    res.status(OK)
      .send({ message: PASSWORD_CHANGED_SUCCESS })
  } catch (err) {
    next(err)
  }
}

const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND))
    }
    const resetToken = generateJwtToken(user.email, JWT_TOKEN_TYPE_RESET_PASSWORD)
    const tokenExpires = Date.now() + 3600000
    await userModel.findByIdAndUpdate(
      user._id,
      {
        passwordResetToken: resetToken,
        passwordResetExpires: tokenExpires,
      },
      { new: true },
    )
    await sendEmailPassswordReset(user.email, `https://yourapp.com/reset-password?token=${resetToken}`)
    res.status(OK).send({
      token: resetToken,
      message: RESET_LINK_TO_EMAIL,
    })
  } catch (err) {
    next(err)
  }
}

const resetPassword = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(AUTHORIZATION_REQUIRED))
  }
  const token = authorization.replace('Bearer ', '')
  const { newPassword, passwordRepeat } = req.body
  try {
    checkPasswords(newPassword, passwordRepeat)
    const decoded = verifyJwtToken(token, JWT_TOKEN_TYPE_RESET_PASSWORD)
    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND)
    }

    if (user.passwordResetToken !== token) {
      throw new ForbiddenError(INVALID_TOKEN)
    }
    if (Date.now() > user.passwordResetExpires) {
      throw new UnauthorizedError(TOKEN_EXPIRED)
    }
    const hash = await hashPassword(newPassword)
    await userModel.findByIdAndDelete(user._id, {
      hash,
      passwordResetToken: null,
      passwordResetExpires: null,
    })
    await sendEmailPasswordChangedSuccess(user.email)
    res.status(OK).send({
      message: PASSWORD_CHANGED_SUCCESS,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUserInfo,
  createUser,
  editUserInfo,
  loginUser,
  signoutUser,
  deleteUser,
  editUserPassword,
  forgotPassword,
  resetPassword,
}
