var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var componentInfo={};
server.listen(80);
// WARNING: app.listen(80) will NOT work here!
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/examples/basic/index.html');
});

app.get('/controller', function (req, res) {
  res.sendFile(__dirname + '/examples/basic/aframeComponentControl.html');
});
// app.get('/dist/socket.io.js', function (req, res) {
//   res.sendFile(__dirname + '/dist/socket.io.js');
// });
app.use('/dist', express.static('dist'))
io.on('connection', function (socket) {
  if(Object.keys(componentInfo).length != 0){
    io.emit('updateComponents', componentInfo);
  }
  socket.on('controlComponent', function (data) {
    console.log('Received Control\n',data);
    componentInfo = data;
    io.emit('updateComponents', componentInfo);
  });
});
