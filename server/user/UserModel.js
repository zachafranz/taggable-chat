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

//Authenticate input against database
//statics is how you add methods to a model i.e. userSchema model
userSchema.statics.authenticate = function (userName, password, next) {
  console.log("we made it to authenticate");
  //find the user from the database
  User.findOne({ userName: userName }).exec((err, user) => {
    //for all else - you have found a user in the db...now authenticate pw
    //Use bcrypt to authenticate password by comparing
    console.log("this is authenticate user: ", user)
    bcyrpt.compare(password, user.password, (err, result) => {
      console.log("this is bcrypt result: ", result);
      console.log(password, user.password);
      if (err) return err;
      if (result === true) return next(null, user);
      else return next();
    });
  });
};
//Hash password before saving it to the database
userSchema.pre('save', function (next) {
  //I want to apply this to each user
  let user = this;
  console.log("Inside of my Pre Hook: ", this);
  //hash takes in - data, salt, callback
  bcyrpt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    //assign the password to the hash
    user.password = hash;
    return next();
  });
});

const User = mongoose.model('User', userSchema);
module.exports = User; 