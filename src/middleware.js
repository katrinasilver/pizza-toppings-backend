const findById = (array) => (req, res, next) => {
  const item = array.find((e) => e.id === req.params.id)

  if (!item) {
    return next({ statusCode: 404, message: 'Not Found' })
  }

  req.result = item
  next()
}

module.exports = { findById }
