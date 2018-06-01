const Message = require('./messageModel');

const getMessages = (req, res) => {
  Message.find({}, (err, foundMessages) => {
      if(err) return res.end(err);
  });
};

const postMessage = (req, res) => {
    let messageToSave;

    Message.create(messageToSave, (err) => {
        if (err) return res.end(err);
          messageToSave = {
            created_by: req.body.name,
            created_at: Date.now,
            message: req.body.message,
            tag: null
        };
    }, (err, message) => {
        if (err) res.status(400).send('error occured in saving message');
        else res.status(200).send(res.json(message));
    });


}

module.exports = { getMessages, postMessage };