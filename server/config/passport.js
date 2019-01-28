const passport = require('passport')
const Strategy = require('passport-local').Strategy
const User = require('../models/User')

passport.use(new Strategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (username, password, done) => {

    User.findOne({ email: username }, (err, user) => {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      
      user.verifyPassword(password.trim(), (err, validPassword) => {

        if (err) { return done(err) }
        if (!validPassword) {
          return done(null, false, { message: 'Incorrect password.' })
        } else {
          return done(null, user)
        }
      })

    })
  }
))

// serialized to the session, and deserialized when subsequent requests are made.
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})

module.exports = passport
