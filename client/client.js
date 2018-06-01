//console.log('in here')
//username = "User"

$(document).ready(function(){

    $('#txtMessage').keypress(function (e) {
        if (e.which == 13) {
            //console.log('I was pressed')
            var chatMessage = $("#txtMessage").val()
            var username = $("#txtName").val()
            $( "#chatlog" ).append(username + ": " + chatMessage + "<br>");
          return false;  
        }
      });

    $("#send").click(function() {
        //console.log('I was clicked')
        var chatMessage = $("#txtMessage").val()
        var username = $("#txtName").val()
        $( "#chatlog" ).append(username + ": " + chatMessage + "<br>");
    })
})

