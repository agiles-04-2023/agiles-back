const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const usersRouter = express.Router()

usersRouter.post('/', authController.signUp)
usersRouter.post('/signin', authController.signIn)
usersRouter.route('/').get(userController.getAllUsers)

module.exports = usersRouter
