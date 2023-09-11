const AppError = require('../helpers/AppError')

const handleSequelizeValidationError = (error) => new AppError(error.errors.map((e) => e.message).join(',,'), 400)
const handleSequelizeForeignKeyConstraintError = (error) =>
  new AppError(
    `Hay problema con la(s) clave(s) foránea(s) (${error.fields?.join(',')}) de la tabla ${error?.table
    }. Asegúrese de enviar los datos correctamente.`,
    400
  )
const handleSequelizeUniqueConstraintError = (error) =>
  new AppError(error.errors.map((e) => e.message).join(',,'), 400)
const handleJsonWebTokenError = () => new AppError('Token  no valido. Inicia sesión de nuevo.', 401)
const handleJWTExpiredToken = () => new AppError('Su token ha caducado. Vuelva a iniciar sesión, por favor.', 401)
const handleSequelizeAccessDeniedError = () =>
  new AppError(
    'Error al intentar conectarse a la base de datos. Verifica que todos los datos de conexión esten correctos.',
    401
  )

const sendError = (err, res) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(err.statusCode).json({
      ok: false,
      status: err.status,
      message: err.message.split(',,')[0],
      errors: err.message.split(',,'),
      error: { ...err, message: err.message },
      stack: err.stack
    })
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      ok: false,
      status: err.status,
      message: err.message.split(',,')[0],
      errors: err.message.split(',,'),
      code: err.statusCode
    })
  }

  return res
    .status(500)
    .json({ ok: false, status: 'error', code: 500, message: '¡¡Algo salió  mal!! Por favor, inténtalo de nuevo.' })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  let error = Object.assign(err)
  // console.log(error);
  if (error.name === 'SequelizeAccessDeniedError') error = handleSequelizeAccessDeniedError()
  if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError()
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredToken()
  if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error)
  if (error.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(error)
  if (error.name === 'SequelizeForeignKeyConstraintError') error = handleSequelizeForeignKeyConstraintError(error)

  sendError(error, res)
}
