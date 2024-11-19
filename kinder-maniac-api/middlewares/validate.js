const { celebrate, Joi } = require('celebrate')
// const { regexForLink } = require('../constants/regex')

const validateUserBodyForSignUp = celebrate({
  body: Joi.object({
    nickname: Joi
      .string()
      .min(2)
      .max(30),
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  }),
})

const validateUserBodyForSignIn = celebrate({
  body: Joi.object({
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  }),
})

const validateUserBodyForPatchUserInfo = celebrate({
  body: Joi.object({
    nickname: Joi
      .string()
      .min(2)
      .max(30)
      .required(),
    email: Joi
      .string()
      .email()
      .required(),
  }),
})

const validateUserBodyForPatchUserPassword = celebrate({
  body: Joi.object({
    newPassword: Joi
      .string()
      .required(),
    passwordRepeat: Joi
      .string()
      .required(),
  }),
})

const validateUserBodyForForgotPassword = celebrate({
  body: Joi.object({
    email: Joi
      .string()
      .email()
      .required(),
  }),
})

// const validateMovieBodyForPost = celebrate({
//   body: Joi.object().keys({
//     country: Joi.string().required(),
//     director: Joi.string().required(),
//     duration: Joi.number().required(),
//     year: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().required().regex(regexForLink),
//     trailerLink: Joi.string().required().regex(regexForLink),
//     thumbnail: Joi.string().required().regex(regexForLink),
//     nameRU: Joi.string().required(),
//     nameEN: Joi.string().required(),
//     movieId: Joi.number().required(),
//   }),
// })

// const validateMovieParams = celebrate({
//   params: Joi.object().keys({
//     _id: Joi.string().required().custom((value, helpers) => {
//       if (!mongoose.Types.ObjectId.isValid(value)) {
//         return helpers.message('Invalid movie ID')
//       }
//       return value
//     }),
//   }),
// })

module.exports = {
  validateUserBodyForPatchUserInfo,
  validateUserBodyForSignUp,
  validateUserBodyForSignIn,
  validateUserBodyForPatchUserPassword,
  validateUserBodyForForgotPassword,
}
