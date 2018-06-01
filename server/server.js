const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

console.log(bodyParser);

const app = express();

//********  conneect to mongo database
mongoose.connect('mongodb://ddeste01:robert123@ds045604.mlab.com:45604/testapp');


//********  express server routes
app.use(express.static(path.join(__dirname, './../client')))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/message', (req, res) => {
  messageController.getMessage(req, res);
});

app.post('/message', (req, res) => {
  res.send('test')
  messageController.postMessage(req, res);

});

app.listen(3000, () => {
  console.log('we have a server');
});
