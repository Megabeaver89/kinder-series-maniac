const router = require('express').Router()
const userController = require('../controllers/users')
const {
  validateUserBodyForSignUp,
  validateUserBodyForSignIn,
  validateUserBodyForForgotPassword,
  validatePasswordChange,
} = require('../middlewares/validate')

router.post('/signin', validateUserBodyForSignIn, userController.loginUser)
router.post('/signup', validateUserBodyForSignUp, userController.createUser)
router.post('/signout', userController.signoutUser)

router.post('/forgot-password', validateUserBodyForForgotPassword, userController.forgotPassword)
router.post('/reset-password', validatePasswordChange, userController.resetPassword)

module.exports = router
