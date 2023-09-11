const catchAsync = require('../helpers/catchAsync')
const { Op } = require('sequelize')
const AppError = require('../helpers/AppError')
const filterQueryParams = require('../helpers/filterqueryParams')

const filterFields = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.all = (Model, opts = null) =>
  catchAsync(async (req, res) => {
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include']
    excludeFields.forEach((el) => delete queryFiltered[el])

    const docs = await Model.findAll({
      where: filterQueryParams(queryFiltered),
      include,
      attributes: req.query.fields
        ? req.query.fields
          .toString()
          .split(',')
          .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order:
        req.query.sort
          ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
          : [['id', 'desc']]
    })
    return res.json({
      status: 'success',
      ok: true,
      code: 200,
      results: docs.length,
      data: docs
    })
  })

exports.paginate = (Model, opts = null) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.limit || !req.query.page) { return next(new Error('El parametro limit y/o page es obligatorio para usar este metodo!')) }
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }

    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include']
    excludeFields.forEach((el) => delete queryFiltered[el])

    const page = parseInt(req.query.page) * 1 || 1
    const limit = parseInt(req.query.limit) * 1 || 50
    const offset = (page - 1) * limit
    const docs = await Model.findAll({
      where: filterQueryParams(queryFiltered),
      include,
      limit,
      offset,
      attributes: req.query.fields
        ? req.query.fields
          .toString()
          .split(',')
          .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order:
        req.query.sort
          ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
          : [['id', 'desc']]
    })

    return res.json({
      results: docs.length,
      code: 200,
      status: 'success',
      ok: true,
      page,
      offset,
      data: docs
    })
  })

exports.findOne = (Model, opts = null) =>
  catchAsync(async (req, res, next) => {
    if (opts) {
      var { include } = opts
    }
    const doc = await Model.findOne({
      where: { id: req.params.id },
      include,
      attributes: req.query.fields
        ? req.query.fields
          .toString()
          .split(',')
          .map((el) => (el.includes(':') ? el.split(':') : el))
        : ''
    })
    if (!doc) return next(new AppError(`No hay registro para el id :  ${req.params.id} `, 404))
    return res.json({
      status: 'success',
      ok: true,
      code: 200,
      data: doc
    })
  })

exports.create = (Model, allowedFileds = []) =>
  catchAsync(async (req, res) => {    
    const doc = await Model.create(req.body)
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El registro fue guardado con éxito',
      data: doc
    })
  })

exports.bulk = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.bulkCreate(req.body)
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El registro fue guardado con éxito',
      data: doc
    })
  })

exports.update = (Model, allowedFileds) =>
  catchAsync(async (req, res, next) => {
    const insertedFileds = filterFields(req.body, allowedFileds)
    const doc = await Model.update(insertedFileds, { where: { id: req.params.id } })
    if (doc[0] <= 0) {
      return next(
        new AppError(
          `No hay registro para el id :  ${req.params.id} o no se actualizó ningún registro en la tabla. `,
          404
        )
      )
    }
    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'El registro fue actualizado con éxito'
    })
  })

exports.down = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.update({ state: 2 }, { where: { id: req.params.id } })
    if (doc[0] <= 0) return next(new AppError(`No hay registro para el id :  ${req.params.id} `, 404))
    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'El registro fue actualizado con éxito',
      data: null
    })
  })

exports.up = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.update({ state: 1 }, { where: { id: req.params.id } })
    if (doc[0] <= 0) return next(new AppError(`No hay registro para el id :  ${req.params.id} `, 404))
    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'El registro fue actualizado con éxito'
    })
  })

exports.destroy = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({ where: { id: req.params.id } })
    if (doc <= 0) return next(new AppError(`No hay registro para el id :  ${req.params.id} `, 404))
    return res.status(200).json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'El registro fue borrado con éxito',
      data: null
    })
  })
