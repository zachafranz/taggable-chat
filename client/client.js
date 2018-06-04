//console.log('in here')
//username = "User"

const createMessageHtml = (messageObj) => {
  // Takes in obj with expected fields: _id, created_by, message

  console.log(messageObj);
  let divElem = $("<div></div>")

  let tagElem = $("<p></p>").addClass('tagsClass hiddenTags');
  messageObj.tag.forEach((elem) => {
    tagElem.append($("<span></span>").text(elem).addClass('tagSpanClass'));
  });

  let messageElem = $("<p></p>").text(messageObj.created_by + ': ' + messageObj.message);
  messageElem.addClass('messageClass notTagable').attr('id', messageObj._id);
  messageElem.click((elem) => {
    if (taggingAction) {
      console.log('Message was clicked', elem.target.id);
      let $elem = $('#' + elem.target.id);
      $elem.hasClass('tagged') ? $elem.removeClass('tagged') : $elem.addClass('tagged')
    }
  })
  divElem.append(messageElem, tagElem);
  return divElem;
}

$(document).ready(function () {
  // grab created_by and message values  
  $("#send").click(() => {
    var chatMessage = { name: $("#txtName").val(), message: $("#txtMessage").val() };
    $.post("http://localhost:3000/message", chatMessage);
  });

  $('#txtMessage').keypress(function (e) {
    if (e.which == 13) {
      //console.log('I was pressed')
      var chatMessage = { name: $("#txtName").val(), message: $("#txtMessage").val() };
      $.post("/message", chatMessage);
      chatMessage.message = '';
      return false;
    }
  });

  let numOfMessages = -10;
  let displayedMessages = [];
  setInterval(() => {
    $.ajax({
      type: "GET",
      url: "/message",
      async: false,
      success: function (response) {
        response.slice(numOfMessages).forEach((message) => {
          if (!displayedMessages.includes(message._id)) {
            displayedMessages.push(message._id)
            $("#chatlog").append(createMessageHtml(message));
          }
        });
      }
    });
  }, 3000);
})

