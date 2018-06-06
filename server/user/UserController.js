const User = require('./UserModel');

const UserController = {
  loginUser(req, res, next) {
    console.log('User info sent', req.body);
    User.findOne({
      userName: req.body.userName,
      password: req.body.password
      
    }).then((foundUser) => {
      console.log('foundUser in DB', foundUser);
      if (!foundUser) res.send('The username and/or password combination does not exist. Please retry.');
      else {
        //res.send(foundUser.userName);
        res.locals.userName = foundUser.userName;
        next();
      }
    }).catch((err) => {
      res.status(400).send('There was an error; please try logging in again.');
    });
  },
  
  createUser(req, res, next) {

    let user = new User({
      userName: req.body.userName,
      password: req.body.password
    });
  
    user.save().then((userDoc) => {
      //res.send(userDoc.userName);
      res.locals.userName = userDoc.userName;
      next();
      }).catch((err) => {
        res.status(400).send('There was an error creating the username. Please retry signup process.')
    });
  }, 

  findUser(req, res, next) {
    User.findOne({userName: req.body.userName}).then((foundUser) => {
      if (!foundUser) next();
      else res.send('User exists!');
    }).catch((err) => {
      console.log('Error when finding user in signup route', err);
      res.status(400).send('There was an error; please retry signup process.');
    });
  }
}
module.exports = UserController;