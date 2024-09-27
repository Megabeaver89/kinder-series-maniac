const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const { errors } = require('celebrate')
const cookieParser = require('cookie-parser')
const { PORT, DB_ADDRESS } = require('./config')
const router = require('./routes')
const NotFoundError = require('./errors/NotFoundError')
const { pageNotFound } = require('./constants/errorMessage')
const handlerError = require('./middlewares/handlerError')

const rateLimiter = require('./middlewares/rateLimiter')
const { requestLogger, errorLogger } = require('./middlewares/logger')

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
const app = express()
app.use(cors())
app.use(rateLimiter)
app.use(express.json())
app.use(helmet())
app.use(requestLogger)
app.use(cookieParser())
app.use('/api', router)
app.use((req, res, next) => {
  next(new NotFoundError(pageNotFound))
})
app.use(errorLogger)
app.use(errors())
app.use(handlerError)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
