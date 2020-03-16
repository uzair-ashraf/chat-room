const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')));

const rooms = {
  'room1' : {
    roomName: 'room1',
    connectedUsers: ['thebearingedge', 'danewavy'],
    messages: [
      {sender: 'thebearingedge', message: 'sup bro'},
      {sender: 'danewavy', message: 'nothin just on wave'}
    ]
  },
  'room2': {
    roomName: 'room2',
    connectedUsers: [],
    messages: []
  },
  'room3': {
    roomName: 'room3',
    connectedUsers: [],
    messages: []
  },
}

app.post('/:roomName', (req, res) => {
  const { roomName } = req.params;
  console.log(roomName);
  if(rooms[roomName]) {
    res.status(409).json({success: false});
    return;
  }
  rooms[roomName] = {
    roomName,
    connectedUsers: [],
    messages: []
  }
  res.json({
    success: true,
    roomName
  })
  io.emit('room-created', {roomName})
})

app.get('/:roomName', (req, res) => {
  const { roomName } = req.params;
  const { username } = req.query;
  // if(rooms[roomName].connectedUsers.includes(username)) {
  //   res.redirect('/');
  // } else {
    rooms[roomName].connectedUsers.push(username);
    console.log(rooms);
    res.render('pages/room', { room: rooms[roomName] });
  // }
})

app.get('/', (req, res) => {
    res.render('pages/index', { rooms });
})

server.listen(3000, () => {
  console.log('server is running on port 3000');
})
