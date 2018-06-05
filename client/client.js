/* eslint-disable */
const createMessageHtml = (messageObj) => {
  // Takes in obj with expected fields: _id, created_by, message

  console.log(messageObj);
  let divElem = $("<div></div>");

  let tagElem = $("<p></p>").addClass('tagsClass hiddenTags');
  messageObj.tag.forEach((elem) => {
    tagElem.append($("<span></span>").text(elem).addClass('tagSpanClass').data('messId', messageObj._id));
    tagElem.click((event) => {
      if (deletingTags) {
        console.log('Remove this from tag array', $(event.target).data('messId'), event.target.innerText);
        $.post(
          "/deleteTag", 
          { messageId: $(event.target).data('messId'), tagText: event.target.innerText },
          (data) => {
            console.log('Done with tag delete', data);
          });
      }
    })
  });

  let messageElem = $("<p></p>").text(messageObj.created_by + ': ' + messageObj.message);
  messageElem.addClass('messageClass notTagable').attr('id', messageObj._id);
  messageElem.click((event)=> {
    if (taggingAction) {
      console.log('Message was clicked', event.target.id);
      let $elem = $('#' + event.target.id);
      $elem.hasClass('tagged') ? $elem.removeClass('tagged') : $elem.addClass('tagged')
    }
  })
  divElem.append(messageElem, tagElem);
  return divElem;
}

let taggingAction = false;
let deletingTags = false;
let loggedInUser = null;
let numOfMessages = -10;
let displayedMessages = [];
let loginGreeting = $("<div></div>");

$(document).ready(function(){
  $(".chatBox").hide();

  $("#send").click(() => {
    var chatMessage = { name: loggedInUser, message: $("#txtMessage").val() };
    $.post("http://localhost:3000/message", chatMessage);
  });

  $('#deleteTagsBtn').click(() => {
    console.log($(".tagSpanClass").data('messId'));
    console.log('Clicked delete tags'); // deletableTagClass
    if (deletingTags) {
      $(".tagSpanClass").removeClass("deletableTagClass");
      deletingTags = false;
    } else {
      $(".tagSpanClass").addClass("deletableTagClass");
      deletingTags = true;
    }
  });

  $("#hideOrShowTagsBtn").click(() => {
    console.log('Clicked hide/show tags');
    if ($('#hideOrShowTagsBtn').text() === 'Show Tags') {
      $("#hideOrShowTagsBtn").text('Hide Tags');
      $(".tagsClass").removeClass("hiddenTags");
    } else {
      $("#hideOrShowTagsBtn").text('Show Tags');
      $(".tagsClass").addClass("hiddenTags");
    }
  });

  $("#selectMessagesBtn").click(() => {
    console.log('Clicked select messages');
    if (!taggingAction) {
      $("#selectMessagesBtn").text('Nevermind');
      $(".messageClass").addClass("tagable");
      taggingAction = true;
    } else {
      $("#selectMessagesBtn").text('Select Messages to Tag');
      $(".messageClass").removeClass("tagable tagged");
      taggingAction = false;
    }
  });

  $("#tagMessagesBtn").click(() => {
    let messageIdArr = [];
    $('.tagged').each((ind, elem) => {
      messageIdArr.push(elem.id);
      console.log(elem.id);
    });
    $.post("/tag", { tagIdArr: messageIdArr, tagText: $('#tageNameInput').val() });
  });

  $('#txtMessage').keypress(function (e) {
    if (e.which == 13) {
      var chatMessage = { name: loggedInUser, message: $("#txtMessage").val() };
      $.post("/message", chatMessage);
    }
  });

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

  $("#login").click(() => {
    
    console.log('clicked Login Buttton');
    
    $.post("http://localhost:3000/login", {
      userName: $("#userName").val(),
      password: $("#password").val()
    }, (response, status) => {
        console.log(response);
        let errResponse = 'The username and/or password combination does not exist. Please retry.';
        if(response === errResponse) alert(response);
        else {
          loggedInUser = response;
          loginGreeting.text(`Welcome back, ${response}!`).addClass("loginGreeting").insertBefore(".appTitle");
          $('.userManager').hide();
          $(".chatBox").show();
        }
    });
  });

  $("#signup").click(() => {
    
    console.log('clicked Signup Buttton');
    
    $.post("http://localhost:3000/signup", {
      userName: $("#userName").val(),
      password: $("#password").val()
    }, (response, status) => {
      let errResponse = 'User exists!';
        if(response === errResponse) alert('The username exits. Please login or select an unique username.');
        else {
          loggedInUser = response;
          loginGreeting.text(`Welcome, ${response}!`).addClass("loginGreeting").insertBefore(".appTitle");
          $('.userManager').hide();
          $(".chatBox").show();
        }
    });
  });
})

