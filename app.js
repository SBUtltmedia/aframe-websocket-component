var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var componentInfo={};
server.listen(8080);
// WARNING: app.listen(80) will NOT work here!
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/examples/basic/index.html');
});

app.get('/controller', function (req, res) {
  res.sendFile(__dirname + '/examples/basic/control.html');
});

app.use('/dist', express.static('dist'))
io.on('connection', function (socket) {

  socket.on('controlComponent', function (data) {
    componentInfo[socket.room] = Object.assign({}, componentInfo[socket.room], data);
    io.to(socket.room).emit('updateComponents', componentInfo[socket.room] );
  });
  socket.on('switchRoom', function (data) {
    console.log('Switch Room\n',data);
    socket.join(data.roomId);
    socket.room = data.roomId;
    io.to(socket.room).emit('updateComponents',  componentInfo[socket.room]);
  });
});
