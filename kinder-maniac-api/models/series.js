const mongoose = require('mongoose')
const validator = require('validator')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const {
  nameRU,
  nameEn,
  year,
  country,
  numberOfFigures,
  currency,
  description,
  image,
} = require('../constants/seriesSchema')
const { incorrectUrlImage } = require('../constants/errorMessage')
const { EUR } = require('../constants/currency')
const figureSchema = require('./figure')

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
      default: 0,
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
  figures: [figureSchema],
})

// Хук для автоматического пересчета стоимости серии на основе стоимости фигурок
seriesSchema.pre('save', function (next) {
  const totalCost = this.figures.reduce((sum, figure) => sum + (figure.costAmount || 0), 0)
  this.costAmount.amount = totalCost

  next()
})

module.exports = mongoose.model('series', seriesSchema)
