const router = require('express').Router()
router.use('/users', require('./usersRoutes'))
router.use('/games', require('./gameRoutes'))

module.exports = router
