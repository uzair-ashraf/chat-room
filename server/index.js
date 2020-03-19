const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')));

const rooms = {}

app.post('/rooms/:roomName', (req, res) => {
  const { roomName } = req.params;
  console.log(roomName);
  if(rooms[roomName]) {
    res.status(409).json({success: false});
    return;
  }
  rooms[roomName] = {
    roomName,
    connectedUsers: {},
    messages: []
  }
  res.json({
    success: true,
    roomName
  })
  io.emit('room-created', {roomName})
})

app.get('/rooms/:roomName', (req, res) => {
  const { roomName } = req.params;
  const { username } = req.query;
  // if(rooms[roomName].connectedUsers.includes(username)) {
  //   res.redirect('/');
  // } else {
    rooms[roomName].connectedUsers[username] = {username};
    console.log(rooms);
    res.render('pages/room', { room: rooms[roomName], user: {username, roomName}});
  // }
})

app.get('/', (req, res) => {
    res.render('pages/index', { rooms });
})

server.listen(3000, () => {
  console.log('server is running on port 3000');
})

// io.on('connection', socket => {
//   console.log('new user connected');
// })

const roomsNamespace = io.of('/rooms')

roomsNamespace.on('connection', socket => {
    socket.on('new-user-connected', (room, name) => {
      console.log(room, name)
      socket.join(room);
      rooms[room].connectedUsers[name].socketId = socket.id;
      socket.to(room).broadcast.emit('user-connected', name)
    })
  })
