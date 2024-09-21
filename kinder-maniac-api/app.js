const express = require('express')
const mongoose = require('mongoose')
const { PORT, DB_ADDRESS } = require('./config')

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
const app = express()



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
