const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const globalErrorHandler = require('./controllers/errorController')
const morgan = require('morgan')
const AppError = require('./helpers/AppError')
const app = express()
app.use(cors())
app.use(helmet())

app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

if (process.env.NODE_ENV !== 'production') {
    const { dbConnect } = require('./db/index')
    require('./schemas/user')
    require('./schemas/game')

    dbConnect
        .sync({ alter: true })
        .then((res) => {
            console.log('DATABASE CONNECTED AND UPDATED!!!')
        })
        .catch((err) => console.log(err))
}
app.get('/api/v1/test', (req, res) => res.json({ status: 'successsss' }))
app.use(require('./routes'))
app.all('*', (req, res, next) =>
    next(new AppError(`No existe esta ruta ${req.originalUrl}.`, 400))
)
app.use(globalErrorHandler)
module.exports = app
