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

socket.on('disconnect',()=>{
  console.log("Connection disocnnected")
});
});

server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});

module.exports = {app};
