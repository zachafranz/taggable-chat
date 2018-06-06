const mongoose = require('mongoose');
const bcyrpt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  }
});

userSchema.pre('save', function (next) {
  bcyrpt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  });
});

const User = mongoose.model('User', userSchema);
module.exports = User; 