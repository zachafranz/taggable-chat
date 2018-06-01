//console.log('in here')
//username = "User"

$(document).ready(function(){

    ////////////////

    function postChat(message){
        console.log('ENTERING POSTCHAT! / SENDING CHATMESSAGE TO SERVER');
        $.post("http://localhost:3000/message", message)
        console.log('Message: ', message);
    }

         $("#send").click(() => {
            console.log('ENTERING CLICK! / CREATING CHAT MESSAGE VAR');
            var chatMessage = {
                name: $("#txtName").val(), message: $("#txtMessage").val()
            }
            postChat(chatMessage)
            console.log('ChatMessage', chatMessage);
        })

        $('#txtMessage').keypress(function (e) {
            if (e.which == 13) {
                //console.log('I was pressed')
                var chatMessage = {
                    name: $("#txtName").val(), message: $("#txtMessage").val()
                }
                postChat(chatMessage)
                console.log('ChatMessage', chatMessage);
              return false;  
            }
        });

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

