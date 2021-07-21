const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 5,
    required: true
  },
  id: {
    type: String,
    maxLength: 50,
    required: true
  },
  department: {
    type: String,
    default: 0
  },
  phone: {
    type: String,
    default: 0,
  },
  comment: {
    type: String,
    default: 0,
  }
});

//save 메소드가 실행되기전에 비밀번호를 암호화하는 로직을 짜야한다
userSchema.pre('save', function (next) {
  const user = this

  bcrypt.hash(user.password, 10, (error, hash) => {
      user.password = hash
      next()
  })
});

const User = mongoose.model('User', userSchema)
module.exports = User
