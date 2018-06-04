//console.log('in here')
var loggedInUser = null;

$(document).ready(function(){
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

    var length = 0;
    setInterval(() => {
      var response = '';
      $.ajax({ 
        type: "GET",   
        url: "/message",   
        async: false,
        success : function(text) {
          response = text;
          if(response.length > length) {
            $( "#chatlog" ).append(`${response[response.length - 1].created_by}: ${response[response.length - 1].message}<br>`);   
            length = response.length;
          }
        }
      });
  }, 200);

  // ***************Shaf's Code - Adding funtionality to Login and Submit buttons for user login or signup*******//
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
  //************** end of Shaf's script code */
})

