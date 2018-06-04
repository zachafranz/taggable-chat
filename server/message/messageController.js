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
  };
  // console.log('message To Save: ', messageToSave);
  Message.create(messageToSave, (err, savedMessage) => {
    if (err) return res.end(err);
    else res.status(200).send(savedMessage);
  });
};

const tagMessages = (req, res) => {
  console.log('In Tag Messages', req.body);
  let idToUpdate = req.body.tagIdArr;
  let tagText = req.body.tagText;

  Message.updateMany(
    { _id: { $in: idToUpdate } },
    { $push: { tag: tagText } },
    { new: true },
    (err, docs) => {
      console.log('error:', err);
      console.log('docs:', docs);
    }
  );
};

const deleteTag = (req, res) => {
  console.log('In Delete Tag', req.body);
  let idToUpdate = req.body.messageId;
  let tagText = req.body.tagText;

  Message.findByIdAndUpdate(
    idToUpdate,
    { $pullAll: { tag: [tagText] } },
    { new: true },
    (err, docs) => {
      console.log('error:', err);
      console.log('docs:', docs);
    }
  );
};


module.exports = { getMessages, postMessage, tagMessages, deleteTag };
