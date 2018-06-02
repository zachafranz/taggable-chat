//console.log('in here')
//username = "User"

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
})

