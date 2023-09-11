const express = require('express')
const gameController = require('../controllers/gameController')
const router = express.Router()

router.get('/', gameController.all)
router.route('/').post(gameController.create)

module.exports = router
