const Message = require('./messageModel');

const getMessages = (req, res) => {
  Message.find({}, (err, foundMessages) => {
      if(err) {
          return res.end(err);
      } else {
          res.send(foundMessages);
      }
  });
};

const postMessage = (req, res) => {
  const messageToSave = {
    created_by: req.body.name,
    created_at: new Date(),
    message: req.body.message,
    tag: req.body.tag
  }
     // console.log('message To Save: ', messageToSave);
  Message.create(messageToSave, (err, savedMessage) => {
    if (err) return res.end(err);
    else res.status(200).send(savedMessage);
  });
}

module.exports = { getMessages, postMessage };