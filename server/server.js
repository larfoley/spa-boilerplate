require('dotenv').config()
const config = require('../config.js')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require('connect-mongo')(session)
const app = express()
const helmet = require('helmet')
const db = mongoose.connection

const authController = require('./controllers/auth')
const usersController = require('./controllers/users')
const accountController = require('./controllers/account')

// initialize database
//=========================
mongoose.connect( process.env.DB, { useNewUrlParser: true })

db.on('error', console.error.bind(console, 'Error connecting to the database'))
db.once('open', () => {
  console.log("Connected to database")
})

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: db }),
    resave: true,
    saveUninitialized: true,
    cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}


// Middleware
//========================
app.use(helmet())
app.use(session(sessionOptions))
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, config.public_path)))
app.use(passport.initialize())
app.use(passport.session())

// Controllers
//========================
app.use('/api/auth', authController)
app.use('/api/users', usersController)
app.use('/api/account', accountController)

// catch 404 and forward to error handler
// ======================================
app.use('/api/*', (req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Send SPA
// ==============
app.use('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, config.spa_path))
})

// error handler
// =============
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log(err.message);
  res.status(err.status || 500).json({message: err.message})
})

module.exports = app
