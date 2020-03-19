
const room = io.connect('//:3000/rooms');

room.emit('new-user-connected', roomName, username);

room.on('user-connected', username => {
  console.log('new user', username);
})
