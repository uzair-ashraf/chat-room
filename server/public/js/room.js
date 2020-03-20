
const room = io.connect('/rooms');

room.emit('new-user-connected', roomName, username);

const usersContainer = document.querySelector('.connected-users-container');
const messageForm = document.getElementById('send-message-form');
const messagesContainer = document.querySelector('.messages-container');

scrollContainerToBottom();

room.on('user-connected', username => {
  const user = document.createElement('div');
  user.className = 'user';
  user.textContent = username;
  usersContainer.appendChild(user);

  const splashMessage = document.createElement("div");
  splashMessage.className = 'splash-message';
  splashMessage.textContent = `${username} has connected!`;
  messagesContainer.appendChild(splashMessage);
  scrollContainerToBottom();
})

room.on('user-disconnected', user => {
  const usersList = Array.from(usersContainer.children);
  const userElement = usersList.find(u => u.innerText === user);
  userElement.remove();

  const splashMessage = document.createElement("div");
  splashMessage.className = 'splash-message disconnect';
  splashMessage.textContent = `${user} has disconnected!`;
  messagesContainer.appendChild(splashMessage);
  scrollContainerToBottom();
})

room.on('new-message', createMessage);

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const message = formData.get('message');
  if(!message) {
    return;
  }
  e.target.reset();
  room.emit('sent-message', roomName, username, message);
  createMessage(username, message);
})

function createMessage(name, message) {
  const messageParent = document.createElement('div');
  const messageSender = document.createElement('span');
  const messageContent = document.createElement('div');

  messageParent.className = 'message';
  messageSender.className = 'message-sender';
  messageContent.className = 'message-content';

  messageSender.textContent = name + ": ";
  messageContent.appendChild(messageSender);
  messageContent.appendChild(document.createTextNode(message));

  messageParent.appendChild(messageContent);

  messagesContainer.appendChild(messageParent);
  scrollContainerToBottom();
}

function scrollContainerToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
