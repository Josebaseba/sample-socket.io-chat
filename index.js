var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080, function serverLoaded(){
  console.log('Server running 8080');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function socketConnected(socket){

  var userName = makeName();

  socket.emit('welcome', {msg: 'Welcome ' + userName + ' to the chat!', me: userName});

  socket.broadcast.emit('userConnected', {user: userName});

  socket.on('message', function(data){
    data.user = userName;
    io.emit('message', data);
  });

  socket.on('disconnect', function(){
    io.emit('userDisconnected', {user: userName});
  });

});


function makeName(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 10; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
