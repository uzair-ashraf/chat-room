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

  if (!rooms[roomName]) {
    res.redirect('/');
    return;
  }

  if(rooms[roomName].connectedUsers[username]) {
    res.redirect('/');
  } else {
    rooms[roomName].connectedUsers[username] = {username};
    res.render('pages/room', { room: rooms[roomName], user: {username, roomName}});
  }
})

app.get('/', (req, res) => {
    res.render('pages/index', { rooms });
})

server.listen(3000, () => {
  console.log('server is running on port 3000');
})

const roomsNamespace = io.of('/rooms')

roomsNamespace.on('connection', socket => {
    socket.on('new-user-connected', (room, name) => {
      socket.join(room);
      rooms[room].connectedUsers[name].socketId = socket.id;
      socket.to(room).broadcast.emit('user-connected', name)
    })
    socket.on('sent-message', (room, name, message) => {
      rooms[room].messages.push({sender: name, message})
      socket.to(room).broadcast.emit('new-message', name, message);
    })
    socket.on('disconnect', () => {
      const userData = findUserData(socket.id);
      if(!userData) return;
      const {room, user} = userData;
      delete rooms[room].connectedUsers[user];
      socket.to(room).broadcast.emit('user-disconnected', user);
    })
  })

  //I really don't like how this looks, I can refactor the rooms variable
  //and that should fix this, but its on the list!
  function findUserData(socketId) {
    for(const room in rooms) {
      const {connectedUsers} = rooms[room];
      for(const user in connectedUsers) {
        if(connectedUsers[user].socketId === socketId) {
          return {room, user}
        }
      }
    }
  }
