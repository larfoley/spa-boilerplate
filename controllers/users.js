const passport = require('passport')
const router = require('express').Router()
const User = require('../models/User')

// Get all users
router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err)
    res.json(users.map(user => ({email: user.email, id: user._id})))
  })
})

router.get('/email/:email', (req, res, next) => {
  let email = req.params.email;
  User.findByEmail(email, (err, user) => {
    if (!user) {
      const error = new Error()
      error.message = "Not Found"
      error.status = 404
      return next(error)
    }
    res.json({email: user.email, id: user._id})
  })
});

router.get('/:id', (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (!user) {
      const error = new Error()
      error.message = "Not Found"
      error.status = 404
      return next(error)
    }
    res.json({email: user.email, id: user._id})
  })
});

module.exports = router
