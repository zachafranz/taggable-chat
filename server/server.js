const messageController = require('./message/messageController')
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

console.log('messageController', messageController);

//********  conneect to mongo database
mongoose.connect('mongodb://ddeste01:Robert123!@ds029824.mlab.com:29824/chatapp');

//********  express server routes
app.use(express.static(path.join(__dirname, './../client')))
// extended true === deep parsing
app.use(bodyParser.urlencoded({extended: true}));
// expect JSON
app.use(bodyParser.json());


//******** routes
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/message', (req, res) => {
  messageController.getMessages(req, res);
});

app.post('/message', (req, res) => {
  messageController.postMessage(req, res);

});

app.listen(3000, () => {
  console.log('we have a server');
});