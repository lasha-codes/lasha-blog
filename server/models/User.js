const mongoose = require('mongoose')

const User = new mongoose.Schema({
  username: { type: String, minlength: 4, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minlength: 4, required: true },
  avatar: { type: String },
  time: String,
})

const UserModel = mongoose.model('User', User)

module.exports = UserModel
