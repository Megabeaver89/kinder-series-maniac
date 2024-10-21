const seriesModel = require('../models/series')
const {
  OK,
  CREATED,
} = require('../constants/statusCodes')

const NotFoundError = require('../errors/NotFoundError')
const ForbiddenError = require('../errors/ForBiddenError')
const { SERIES_NOT_FOUND, SERIES_CANNOT_DELETE_NOT_ADDED } = require('../constants/errorMessage')

const getCurrentUserSeries = (req, res, next) => {
  const userId = req.user._id
  seriesModel.find({ owner: userId })
    .then((series) => res.status(OK).send(series))
    .catch(next)
}

const createSeries = (req, res, next) => {
  const owner = req.user._id
  const {
    seriesId,
    nameRu,
    nameEn,
    year,
    country,
    numberOfFigures,
    costAmount,
    description,
    image,
    figures,
  } = req.body
  seriesModel.create({
    seriesId,
    nameRu,
    nameEn,
    year,
    country,
    numberOfFigures,
    costAmount,
    description,
    image,
    figures,
    owner,
  }).then((newSeries) => res.status(CREATED).send(newSeries))
    .catch(next)
}

const deleteSeries = (req, res, next) => {
  seriesModel.findOne({ _id: req.params._id })
    .then((series) => {
      if (!series) {
        return next(new NotFoundError(SERIES_NOT_FOUND))
      }
      if (series.owner.toString() !== req.user._id) {
        return next(new ForbiddenError(SERIES_CANNOT_DELETE_NOT_ADDED))
      }
      return series.deleteOne()
        .then(() => res.status(OK).send(series))
    })
    .catch(next)
}

module.exports = {
  deleteSeries,
  createSeries,
  getCurrentUserSeries,
}
