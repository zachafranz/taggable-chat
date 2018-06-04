const messageController = require('./message/messageController');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//********  conneect to mongo database
mongoose.connect('mongodb://ddeste01:Robert123!@ds029824.mlab.com:29824/chatapp');
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});
 
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

app.post('/tag', messageController.tagMessages);
app.post('/deleteTag', messageController.deleteTag);

app.listen(3000, () => {
  console.log('listening on Port 3000');
});