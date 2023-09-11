const Game = require('../schemas/game')
const User = require('../schemas/user')
const { all, create, findOne, update, destroy } = require('./factoryController')

exports.all = all(Game, { include: [{ model: User, attributes: ['fullName', 'email', 'photo'] }] })
exports.create = create(Game)
exports.findOne = findOne(Game, { include: [{ model: User }] })
exports.update = update(Game, [])
exports.destroy = destroy(Game)
