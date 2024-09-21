const express = require('express')
const mongoose = require('mongoose')
const { PORT, DB_ADDRESS } = require('./config')
const router = require('./routes')
const NotFoundError = require('./errors/NotFoundError')
const { pageNotFound } = require('./constants/errorMessage')

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
const app = express()
app.use('/api', router)
app.use((req, res, next) => {
  next(new NotFoundError(pageNotFound))
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
