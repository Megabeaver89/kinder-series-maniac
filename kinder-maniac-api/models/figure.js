const mongoose = require('mongoose')
const validator = require('validator')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const { INCORRECT_URL_IMAGE } = require('../constants/errorMessage')
const { EUR } = require('../constants/currency')
const {
  NAME_EN,
  COST_AMOUNT,
  CURRENCY,
  DESCRIPTION,
  IMAGE,
} = require('../constants/figureSchema')

const figureSchema = new mongoose.Schema({
  nameRu: {
    type: String,
  },
  nameEn: {
    type: String,
    required: [true, mustBeFilled(NAME_EN)],
  },
  year: {
    type: Number,
  },
  country: {
    type: String,
  },
  costAmount: {
    amount: {
      type: Number,
      required: [true, mustBeFilled(COST_AMOUNT)],
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
})

// прехук для автоматического копирования года и страны из родительской серии//
figureSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('year') || this.isModified('country')) {
    const parent = this.parent()
    if (parent) {
      if (this.isModified('year')) {
        this.set('year', parent.year)
      }
      if (this.isModified('country')) {
        this.set('country', parent.country)
      }
    }
  }
  next()
})
///

module.exports = mongoose.model('figure', figureSchema)
