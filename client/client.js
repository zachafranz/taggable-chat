/* eslint-disable */
const createMessageHtml = (messageObj) => {
  // Takes in obj with expected fields: _id, created_by, message

  console.log(messageObj);
  let divElem = $("<div></div>").addClass('messContClass js-div-' + messageObj._id);

  let tagContainer = $("<p></p>").addClass('tagsClass');
  if ($('#hideOrShowTagsBtn').text() === 'Show Tags') tagContainer.addClass("hiddenTags");

  messageObj.tag.forEach((elem) => {
    let tagElem = $("<span></span>").text(elem).addClass('tagSpanClass')
      .data({'messageid': messageObj._id, 'tags': messageObj.tag})
    if (deletingTags) tagElem.addClass("deletableTagClass");

    tagElem.click((event) => {
      if (deletingTags) {
        console.log('Remove this from tag array', $(event.target).data('messageid'), event.target.innerText);
        console.log('Tags are currently', $(event.target).data('tags'))
        let messageOfTagId = $(event.target).data('messageid');

        if (ALL_FILTERS.length !== 0 &&
          !$(event.target).data('tags')
            .filter((elem) => elem !== event.target.innerText)
            .some((tag) => ALL_FILTERS.includes(tag)) 
          ) {
          console.log(displayedMessages);
          //remove element from html and mem array if there are filters and there are no tags that match
          displayedMessages.splice(displayedMessages.findIndex((obj) => obj.id === messageOfTagId) ,1);
          console.log(displayedMessages);
          $('.js-div-' + messageOfTagId).remove();
        }
        $.post(
          "/deleteTag", 
          { messageId: messageOfTagId, tagText: event.target.innerText },
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
};

const createFilterTagHtml = (filterTag) => {
  let filterTagElem = $("<div></div>").text(filterTag);
  filterTagElem.click((event)=> {
    ALL_FILTERS.splice(ALL_FILTERS.indexOf(event.target.innerText), 1);
    displayedMessages = [];
    $("#chatlog").empty();
    $(event.target).remove();
  })
  return filterTagElem;
};

let taggingAction = false;
let deletingTags = false;
let loggedInUser = null;
let numOfMessages = -10;
let displayedMessages = [];
let loginGreeting = $("<div></div>");
let ALL_FILTERS = [];

const compareTagArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((elem, ind) => elem === arr2[ind]);
}

$(document).ready(function(){
  $(".chatBox").hide();

  $("#send").click(() => {
    var chatMessage = { name: loggedInUser, message: $("#txtMessage").val() };
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
      var chatMessage = { name: loggedInUser, message: $("#txtMessage").val() };
      $.post("/message", chatMessage);
    }
  });

  setInterval(() => {
    if (loggedInUser === null) return;
    $.ajax({
      type: "GET",
      url: "/message",
      async: false,
      success: function (response) {
        response.slice( Math.min(numOfMessages, -1 * displayedMessages.length) ).forEach((message) => {
          if (ALL_FILTERS.length === 0 || ALL_FILTERS.some((filter) => message.tag.includes(filter))) {
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
          } else {
            console.log('Did not pass filters');
            console.log('filters',ALL_FILTERS);
            console.log('messageTags', message.tag);
          }
        });
      }
    });
  }, 5000);

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

  $("#filterMessagesBtn").click(() => {
    console.log('Filtering Messages');
    let filterText = $("#filterTagsInput").val();
    ALL_FILTERS.push(filterText);
    console.log('Filters are now', ALL_FILTERS);
    displayedMessages = [];
    $("#chatlog").empty();
    $('#filterContainer').append(createFilterTagHtml(filterText))
  });
})

