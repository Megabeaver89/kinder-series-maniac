const router = require('express').Router()
const routerAuth = require('./auth')
const routerUsers = require('./users')

router.use('/', routerAuth)
router.use('/users', routerUsers)

module.exports = router
