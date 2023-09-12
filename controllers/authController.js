const { promisify } = require('util')
const catchAsync = require('../helpers/catchAsync')
const User = require('./../schemas/user')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')

const createToken = (user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN_2023, {
    expiresIn: process.env.SECRET_TOKEN_INSPIRE_IN
  })
}

const createSendToken = async (user, statusCode, res) => {
  const token = createToken({
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    role: user.role,
    id: user.id
  })

  user.password = undefined

  return res.status(statusCode).json({
    status: 'success',
    ok: true,
    code: 200,
    token,
    user
  })
}

exports.signUp = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  // return
  const newUser = await User.create(req.body)
  createSendToken(newUser, 201, res)
})

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) { return next(new AppError('Proporcione un correo electrónico y una contraseña por favor.', 400)) }

  const user = await User.findOne({ where: { email } })

  if (!user || !(await user.checkPassword(password, user.password))) { return next(new AppError('Correo o contraseña incorrectos.', 401)) }

  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('No has iniciado sesión, ¡identifícate para obtener acceso!', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN_MARANI_APP_2023)
  const currentUser = await User.findByPk(decoded.id)

  if (!currentUser) {
    return next(new AppError('El usuario ya no existe', 401))
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('Este usuario cambió recientemente su contraseña. Inicie sesión de nuevo', 401))
  }

  req.user = currentUser

  next()
})

exports.renewToken = catchAsync(async (req, res, next) => {
  createSendToken(req.user, 200, res)
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('No tienes permiso para realizar esta acción', 403))
    next()
  }
}
