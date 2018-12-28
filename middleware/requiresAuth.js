module.exports = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    const error = new Error('user is not authorized')
    error.status = 401
    next(error)
  }
}
