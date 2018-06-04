const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const messageController = require('./message/messageController');
const UserController = require('./user/UserController');

//not sure if we need this line
mongoose.Promise = global.Promise;
const app = express();

//********  conneect to mongo database
mongoose.connect('mongodb://ddeste01:Robert123!@ds029824.mlab.com:29824/chatapp');

//********  express server routes
app.use(express.static(path.join(__dirname, './../client')));
// extended true === deep parsing
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//******** routes
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/message', messageController.getMessages);
app.post('/message', messageController.postMessage);


// ****** Shaf's code - Adding routes to handle user login and signup ********
app.post('/login', UserController.loginUser);
app.post('/signup', UserController.findUser, UserController.createUser);

// **** end of Shaf's code *******
app.listen(3000, () => {
  console.log('listening on Port 3000');
});