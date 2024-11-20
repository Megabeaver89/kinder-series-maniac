const router = require('express').Router()
const auth = require('../middlewares/auth')
const userController = require('../controllers/users')
const {
  validateUserBodyForPatchUserInfo,
  validatePasswordChange,
  validateUserBodyForForgotPassword,
} = require('../middlewares/validate')

router.post('/forgot-password', validateUserBodyForForgotPassword, userController.forgotPassword)
router.post('/reset-password', validatePasswordChange, userController.resetPassword)

router.use(auth)

router.get('/me', userController.getUserInfo)
router.patch('/me', validateUserBodyForPatchUserInfo, userController.editUserInfo)
router.patch('/me/password', validatePasswordChange, userController.editUserPassword)
router.delete('/me', userController.deleteUser)

module.exports = router
