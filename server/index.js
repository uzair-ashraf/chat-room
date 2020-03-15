const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')));

const rooms = {
  'hellooo world' : {
    connectedUsers: [],
    messages: []
  },
  'this ma room': {
    connectedUsers: [],
    messages: []
  },
  'a suh': {
    connectedUsers: [],
    messages: []
  },
}

app.post('/:roomName', (req, res) => {
  const { roomName } = req.params;
  console.log(roomName);
  if(rooms[roomName]) {
    res.status(409).json({success: false})
  }
})

app.get('/', (req, res) => {
    res.render('pages/index', { rooms });
})

app.listen(3000, () => {
  console.log('server is running on port 3000');
})
