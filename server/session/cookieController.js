const User = require('./../user/UserModel');

const cookieController = {
  
  setCookie: (req, res, next) => {
    // let cookie = req.cookies.Username;
    // console.log('our cookie: ', cookie);
    // if(cookie === undefined) {
      res.cookie('TagChatUserName', res.locals.userName, {httpOnly: true});
      console.log('our cookie: ', res.cookies);
      console.log('res.locals.userName: ', res.locals.userName);
      res.send(res.locals.userName);
    
  },

  checkCookie: (req, res, next) => {
    if (req.cookies.TagChatUserName) {
      console.log('Our cookie: ', req.cookies);
      User.findOne({userName: req.cookies.TagChatUserName}).then((foundUser) => {
        if (foundUser) {
          console.log('Valid cookie, username exists: ', foundUser)
          next();
        }
        else res.redirect('/');
      }).catch((err) => {
        console.log('There was an error validating user. Please retry.')
        res.status(400).send('There was an error validating user. Please retry.')
      });   
    } else {
      res.redirect('/');
    }
  }
}


module.exports = cookieController;