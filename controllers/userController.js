const User = require('../schemas/user')
const factory = require('./factoryController')
exports.getAllUsers = factory.all(User)
