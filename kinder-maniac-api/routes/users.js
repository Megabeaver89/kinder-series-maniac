const router = require('express').Router()
const auth = require('../middlewares/auth')
const userController = require('../controllers/users')
const {
  validateUserBodyForPatchUserInfo,
  validatePasswordChange,
} = require('../middlewares/validate')

router.use(auth)

router.get('/me', userController.getUserInfo)
router.patch('/me', validateUserBodyForPatchUserInfo, userController.editUserInfo)
router.patch('/me/password', validatePasswordChange, userController.editUserPassword)
router.delete('/me', userController.deleteUser)

module.exports = router
