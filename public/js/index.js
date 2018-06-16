var socket=io();

socket.on('connect',function (){
  console.log("Connected to server");

  /*socket.emit('createMessage',{
    from:'heh@wx.com',
    text:'Wht ip'
  });*/
});

socket.on('newMessage', function(message){
  var formattedTime=moment(message.createdAt).format('h:mm a');
  var template = jQuery("#message-template").html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:formattedTime
  });


  /*var li=jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);*/

  jQuery('#messages').append(html);
});

socket.on('newLocationMessage',function(message){
  var formattedTime=moment(message.createdAt).format('h:mm a');
  var template=jQuery("#location-message-template").html();
  var html=Mustache.render(template,{
    url:message.url,
    from:message.from,
    createdAt:formattedTime
  });
/*  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank">My Current Location</a>')
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href',message.url);
  li.append(a);*/
  jQuery('#messages').append(html);
});

socket.on('disconnect',function (){
  console.log("Disconnected");
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

  var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage',{
    from:'User',
    text:messageTextBox.val()
  },function(){
      messageTextBox.val('');
  });
});

var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('geoloaction not supported your browser');
  }

  locationButton.attr('disabled','disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position){

    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send location');
  },function(){

    locationButton.removeAttr('disabled').text('Send location');
    alert('unable to fetch location');
  });

});
