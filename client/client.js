/* eslint-disable */
const createMessageHtml = (messageObj) => {
  // Takes in obj with expected fields: _id, created_by, message

  console.log(messageObj);
  let divElem = $("<div></div>").addClass('messContClass js-div-' + messageObj._id);

  let tagContainer = $("<p></p>").addClass('tagsClass');
  if ($('#hideOrShowTagsBtn').text() === 'Show Tags') tagContainer.addClass("hiddenTags");

  messageObj.tag.forEach((elem) => {
    let tagElem = $("<span></span>").text(elem).addClass('tagSpanClass').data('messageid', messageObj._id)
    if (deletingTags) tagElem.addClass("deletableTagClass");

    tagElem.click((event) => {
      if (deletingTags) {
        console.log('Remove this from tag array', $(event.target).data('messageid'), event.target.innerText);
        $.post(
          "/deleteTag", 
          { messageId: $(event.target).data('messageid'), tagText: event.target.innerText },
          (data) => {
            console.log('Done with tag delete', data);
          });
      }
    })

    tagContainer.append(tagElem);
  });

  let messageElem = $("<p></p>").text(messageObj.created_by + ': ' + messageObj.message);
  messageElem.addClass('messageClass').attr('id', messageObj._id);
  if (taggingAction) messageElem.addClass("tagable");
  
  messageElem.click((event)=> {
    if (taggingAction) {
      console.log('Message was clicked', event.target.id);
      let $elem = $('#' + event.target.id);
      $elem.hasClass('tagged') ? $elem.removeClass('tagged') : $elem.addClass('tagged')
    }
  })
  divElem.append(messageElem, tagContainer);
  return divElem;
}

let taggingAction = false;
let deletingTags = false;
let loggedInUser = null;
let numOfMessages = -10;
let displayedMessages = [];

const compareTagArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((elem, ind) => elem === arr2[ind]);
}

$(document).ready(function(){

  $("#send").click(() => {
    var chatMessage = { name: $("#txtName").val(), message: $("#txtMessage").val() };
    $.post("http://localhost:3000/message", chatMessage);
  });

  $('#deleteTagsBtn').click(() => {
    console.log($(".tagSpanClass").data('messageid'));
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
      $("#deleteTagsBtn").removeAttr("disabled"); 
    } else {
      $("#hideOrShowTagsBtn").text('Show Tags');
      $(".tagsClass").addClass("hiddenTags");
      $(".tagSpanClass").removeClass("deletableTagClass");
      $("#deleteTagsBtn").attr("disabled", "disabled");
    }
  });

  $("#selectMessagesBtn").click(() => {
    console.log('Clicked select messages');
    if (!taggingAction) {
      $("#selectMessagesBtn").text('Done Tagging');
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
    $(".messageClass").removeClass("tagged");
    $.post("/tag", { tagIdArr: messageIdArr, tagText: $('#tageNameInput').val() });
  });

  $('#txtMessage').keypress(function (e) {
    if (e.which == 13) {
      var chatMessage = { name: $("#txtName").val(), message: $("#txtMessage").val() };
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
          if ( displayedMessages.length === 0 ||  !displayedMessages.map((obj) => obj.id).includes(message._id) ) {
              displayedMessages.push({ id: message._id, tags: message.tag })
              $("#chatlog").append(createMessageHtml(message));
          } else if (
              displayedMessages.map((obj) => obj.id).includes(message._id) && 
              !compareTagArrays(message.tag, displayedMessages.filter((obj) => obj.id === message._id)[0].tags)
            ) {
              let objToModify = displayedMessages.findIndex((obj) => obj.id === message._id);
              displayedMessages[objToModify].tags = message.tag;
              $(".js-div-" + message._id).replaceWith(createMessageHtml(message))
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
    });
  });

  $("#signup").click(() => {
    
    console.log('clicked Login Buttton');
    
    $.post("http://localhost:3000/signup", {
      userName: $("#userName").val(),
      password: $("#password").val()
    }, (response, status) => {
        console.log(response);
    });
  });
})

