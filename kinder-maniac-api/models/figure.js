const mongoose = require('mongoose')
const validator = require('validator')
const { mustBeFilled } = require('../helpers/mustBeFilled')
const { incorrectUrlImage } = require('../constants/errorMessage')
const { EUR } = require('../constants/currency')
const {
  nameEn,
  costAmount,
  currency,
  description,
  image,
} = require('../constants/figureSchema')

const figureSchema = new mongoose.Schema({
  nameRu: {
    type: String,
  },
  nameEn: {
    type: String,
    required: [true, mustBeFilled(nameEn)],
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

module.exports = mongoose.model('figure', figureSchema)
