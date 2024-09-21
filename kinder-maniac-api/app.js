const express = require('express')
const mongoose = require('mongoose')
const { PORT, DB_ADDRESS } = require('./config')
const router = require('./routes')
const NotFoundError = require('./errors/NotFoundError')
const { pageNotFound } = require('./constants/errorMessage')
const { errors } = require('celebrate')
const handlerError = require('./middlewares/handlerError')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimiter = require('./middlewares/rateLimiter')

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
const app = express()
app.use(rateLimiter)
app.use(helmet())
app.use(cookieParser())
app.use('/api', router)
app.use((req, res, next) => {
  next(new NotFoundError(pageNotFound))
})
app.use(errors())
app.use(handlerError)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
