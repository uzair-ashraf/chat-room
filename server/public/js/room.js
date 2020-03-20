
const room = io.connect('/rooms');

room.emit('new-user-connected', roomName, username);

const usersContainer = document.querySelector('.connected-users-container');
const messageForm = document.getElementById('send-message-form');
const messagesContainer = document.querySelector('.messages-container');

scrollContainerToBottom();

let notificationPermission = null;
let notificationInProgress = false;


const showNotification = async (username, type) => {
  if(notificationInProgress || !document.hidden) return;
  if (('Notification' in window)) {
    if (notificationPermission !== 'denied') {
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        if(permission === 'granted') {
          let message = null
          if(type === 'new-message') {
            message = `New Message from ${username}!`
          } else if(type === 'new-user') {
            message = `${username} has joined your room!`
          } else {
            message = `${username} has left your room!`
          }
          notificationInProgress = true;
          const notification = new Notification(message, {
            icon: '/images/favico.ico'
          });
          const closeFunc = notification.close.bind(notification)
          setTimeout(() => {
            closeFunc();
            notificationInProgress = false;
          }, 5000);
        }
      }
    }
  }

room.on('user-connected', username => {
  showNotification(username, 'new-user');
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
  showNotification(user, 'disconnected-user');
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
  showNotification(name, 'new-message');
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
