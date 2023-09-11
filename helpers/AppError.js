class AppError extends Error {
  constructor (message, statusCode, name = null) {
    // because the constructor of error need the message parameter
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.name = name
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
