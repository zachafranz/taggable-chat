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
      next();
    } else {
      res.redirect('/');
    }
  }
}

module.exports = cookieController;