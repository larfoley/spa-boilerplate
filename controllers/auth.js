const passport = require('passport')
const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const requiresAuth = require('../middleware/requiresAuth')
const { check, validationResult } = require('express-validator/check')

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json({message: "authentication successful"});
  }
);

router.post('/logout', (req, res) => {
  req.logout()
  res.json({message: "logged out"})
})

router.post('/register', [
  check('email').isEmail(),
  check('password').isLength({ min: 5 })
],
(req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body

  User.findOne({email}).exec((err, user) => {
    if (err) { return next(err) }

    if (user) {
      error = new Error('user already exists')
      error.status = 400
      return next(error)
    }

    bcrypt.hash(password, 10, (err, passwordHash) => {
      if (err) return next(err)
      const user = new User({ email, passwordHash })
      user.save(err => {
        if (err) { return next(err) }
        res.status(200).json({
          message: "user registered",
          user_id: user._id
        })
      })
    })
  })
})




module.exports = router
