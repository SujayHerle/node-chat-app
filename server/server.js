const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'../public');
const express = require('express');
const socketIO=require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const port=process.env.PORT||3000;
var app = express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));
io.on('connection',(socket)=>{
console.log("New connection");

/*socket.emit('newMessage',{
  to:'herl@exa.com',
  text:'Whats up',
  createAtL:123
});*/
socket.emit('newMessage',generateMessage('Admin','Welcometo hcat app'));

socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

socket.on('createMessage',(Message,callback)=>{
  console.log('createMessage',Message);
  io.emit('newMessage',generateMessage(Message.from,Message.text));
  /*socket.broadcast.emit('newMessage',{
    from:Message.from,
    text:Message.text,
    createdAt:new Date().getTime()
  });*/
  callback();
});

socket.on('createLocationMessage',(coords)=>{
  io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

socket.on('disconnect',()=>{
  console.log("Connection disocnnected")
});
});

server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});

module.exports = {app};
