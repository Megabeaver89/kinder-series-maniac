const mongoose = require('mongoose')
const validator = require('validator')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const {
  NAME_RU,
  NAME_EN,
  YEAR,
  COUNTRY,
  NUMBER_OF_FIGURES,
  CURRENCY,
  DESCRIPTION,
  IMAGE,
  SERIES_ID,
} = require('../constants/seriesSchema')
const { INCORRECT_URL_IMAGE } = require('../constants/errorMessage')
const { EUR } = require('../constants/currency')
const figureSchema = require('./figure')

const seriesSchema = new mongoose.Schema({
  seriesId: {
    type: String,
    required: [true, mustBeFilled(SERIES_ID)],
  },
  nameRu: {
    type: String,
    required: [true, mustBeFilled(NAME_RU)],
  },
  nameEn: {
    type: String,
    required: [true, mustBeFilled(NAME_EN)],
  },
  year: {
    type: Number,
    required: [true, mustBeFilled(YEAR)],
  },
  country: {
    type: String,
    required: [true, mustBeFilled(COUNTRY)],
  },
  numberOfFigures: {
    type: String,
    required: [true, mustBeFilled(NUMBER_OF_FIGURES)],
  },
  costAmount: {
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      required: [true, CURRENCY],
      default: EUR,
    },
  },
  description: {
    type: String,
    required: [true, mustBeFilled(DESCRIPTION)],
  },
  image: {
    type: String,
    required: [true, mustBeFilled(IMAGE)],
    validate: {
      validator: (v) => validator.isURL(v),
      message: INCORRECT_URL_IMAGE,
    },
  },
  figures: [figureSchema],
})

// Хук для автоматического пересчета стоимости серии на основе стоимости фигурок
seriesSchema.pre('save', function (next) {
  const totalCost = this.figures.reduce((sum, figure) => sum + (figure.costAmount || 0), 0)
  this.costAmount.amount = totalCost

  next()
})

module.exports = mongoose.model('series', seriesSchema)
