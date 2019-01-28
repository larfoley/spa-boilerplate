var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true }
})

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.passwordHash, (err, res) => {
    cb(err, res)
  })
}

var User = mongoose.model('User', userSchema);


module.exports = User
