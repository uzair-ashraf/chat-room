
const room = io.connect('//:3000/rooms');

room.emit('new-user-connected', roomName, username);

const usersContainer = document.querySelector('.connected-users-container');


room.on('user-connected', username => {
  const user = document.createElement('div');
  user.className = 'user';
  user.textContent = username;
  usersContainer.appendChild(user);
})
