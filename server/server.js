const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'../public');
const express = require('express');
const socketIO=require('socket.io');

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
socket.emit('newMessage',{
  from:'Admin',
  text:'Welcometo hcat app',
  createdAt:new Date().getTime()
});

socket.broadcast.emit('newMessage',{
  from:'Admin',
  text:'new user joined',
  createdAt:new Date().getTime()
});

socket.on('createMessage',(Message)=>{
  console.log('createMessage',Message);
  /*io.emit('newMessage',{
    from:Message.from,
    text:Message.text,
    createdAt:new Date().getTime()
  });*/
  /*socket.broadcast.emit('newMessage',{
    from:Message.from,
    text:Message.text,
    createdAt:new Date().getTime()
  });*/
});

socket.on('disconnect',()=>{
  console.log("Connection disocnnected")
});
});

server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});

module.exports = {app};
