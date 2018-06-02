//console.log('in here')
//username = "User"

$(document).ready(function(){

    ////////////////
    var response = '';
    $.ajax({ type: "GET",   
             url: "http://localhost:3000/message",   
             async: false,
             success : function(text)
             {
                 response = text;
             }
    });
    console.log('response: ', response);
    // for each obj in response obj
    response.forEach(function(el) {
        $( "#chatlog" ).append(el.created_by + ': ' + el.message + "<br>"); 
    });
      // grab created_by and message values
    


         $("#send").click(() => {
            console.log('ENTERING CLICK! / CREATING CHAT MESSAGE VAR');
            var chatMessage = {
                name: $("#txtName").val(), message: $("#txtMessage").val()
            }
            $.post("http://localhost:3000/message", chatMessage);
        })

        $('#txtMessage').keypress(function (e) {
            if (e.which == 13) {
                //console.log('I was pressed')
                var chatMessage = {
                    name: $("#txtName").val(), message: $("#txtMessage").val()
                }
                $.post("http://localhost:3000/message", chatMessage);
              return false;  
            }
        });

        // $.get("http://localhost:3000/message");

        // $.when( $("#send").click(() => {
        //     console.log('in click');
        //     var chatMessage = {
        //         name: $("#txtName").val(), message: $("#txtMessage").val()
        //     }
        //     //postChat(message)
        // })).then(postChat(chatMessage))
    
    
    ////////////
    
    // $('#txtMessage').keypress(function (e) {
    //     if (e.which == 13) {
    //         //console.log('I was pressed')
    //         var chatMessage = $("#txtMessage").val()
    //         var username = $("#txtName").val()
    //         $( "#chatlog" ).append(username + ": " + chatMessage + "<br>");
    //       return false;  
    //     }
    //   });

    // $("#send").click(function() {
    //     //console.log('I was clicked')
    //     var chatMessage = $("#txtMessage").val()
    //     var username = $("#txtName").val()
    //     $( "#chatlog" ).append(username + ": " + chatMessage + "<br>");
    // })

    
})

