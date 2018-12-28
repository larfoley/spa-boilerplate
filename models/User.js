var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true }
})

userSchema.statics.findByEmail = function(email, cb) {
  return this.find({ email: new RegExp(email, 'i') }, cb);
}

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.passwordHash, (err, res) => {
    cb(err, res)
  })
}

var User = mongoose.model('User', userSchema);


module.exports = User
