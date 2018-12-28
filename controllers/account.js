const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const requiresAuth = require('../middleware/requiresAuth')
const { check, validationResult } = require('express-validator/check')

router.post('/change-password',
  [
    check('newPassword').isLength({ min: 5 })
  ],
  requiresAuth,
  (req, res, next) => {
  const newPassword = req.body.newPassword

  User.findById(req.user._id, (err, user) => {
    if (err) { return next(err) }
    if (!user) { return next(err) }

    bcrypt.hash(newPassword, 10, (err, passwordHash) => {
      if (err) return next(err)
      user.passwordHash = passwordHash
      user.save((err) => {
        if (err) { return next(err) }
        res.json({message: "password updated"})
      })
    })

  })
})

router.post('/change-email',
  [
    check('newEmail').isEmail()
  ],
  requiresAuth,
  (req, res, next) => {
  const email = req.body.newEmail

  User.findById(req.user._id, (err, user) => {
    if (err) { return next(err) }
    if (!user) { return next(err) }

    User.find({ email }, (err, users) => {
      if (users.length) {
        const error = new Error()
        error.message = "Email address is already taken"
        error.status = 400
        return next(error)
      }

      user.email = email
      user.save((err) => {
        if (err) { return next(err) }
        res.json({message: "email updated"})
      })

    })

  })
})

router.delete('/', requiresAuth, (req, res, next) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) { return next(err) }
    req.logout()
    res.json({message: "account deleted"})
  })
})

module.exports = router
