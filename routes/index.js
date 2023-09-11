const router = require('express').Router()
router.use('/api/v1/users', require('./usersRoutes'))
router.use('/api/v1/games', require('./gameRoutes'))

module.exports = router
