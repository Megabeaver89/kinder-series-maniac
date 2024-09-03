const mongoose = require('mongoose')
const validator = require('validator')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const {
  nameRU,
  nameEn,
  year,
  country,
  numberOfFigures,
  costAmount,
  currency,
  description,
  image,
} = require('../constants/seriesSchema')
const { incorrectUrlImage } = require('../constants/errorMessage')
const { EUR } = require('../constants/currency')

const seriesSchema = new mongoose.Schema({
  nameRu: {
    type: String,
    required: [true, mustBeFilled(nameRU)],
  },
  nameEn: {
    type: String,
    required: [true, mustBeFilled(nameEn)],
  },
  year: {
    type: Number,
    required: [true, mustBeFilled(year)],
  },
  country: {
    type: String,
    required: [true, mustBeFilled(country)],
  },
  numberOfFigures: {
    type: String,
    required: [true, mustBeFilled(numberOfFigures)],
  },
  costAmount: {
    amount: {
      type: Number,
      required: [true, mustBeFilled(costAmount)],
    },
    currency: {
      type: String,
      required: [true, currency],
      default: EUR,
    },
  },
  description: {
    type: String,
    required: [true, mustBeFilled(description)],
  },
  image: {
    type: String,
    required: [true, mustBeFilled(image)],
    validate: {
      validator: (v) => validator.isURL(v),
      message: incorrectUrlImage,
    },
  },
})

module.exports = mongoose.model('series', seriesSchema)
