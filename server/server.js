const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'../public');
const express = require('express');
const socketIO=require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const{isRealString}=require('./utils/validation.js');
const{Users}=require('./utils/users.js');
const port=process.env.PORT||3000;
var app = express();
var server=http.createServer(app);
var io=socketIO(server);
var users=new Users();

app.use(express.static(publicPath));
io.on('connection',(socket)=>{
console.log("New connection");

/*socket.emit('newMessage',{
  to:'herl@exa.com',
  text:'Whats up',
  createAtL:123
});*/

socket.on('join',(params,callback) =>{
  if(!isRealString(params.name) || !isRealString(params.room)){
    return callback("Name and Room name are required");
  }

  socket.join(params.room);
  users.removeUser(socket.id);
  users.addUser(socket.id,params.name,params.room);

  io.to(params.room).emit('updateUserList', users.getUserList(params.room));
  socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'));

  socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
  callback();
});

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
  var user=users.removeUser(socket.id);
  if(user){
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
  }
});
});

server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});

module.exports = {app};
