const createRoomForm = document.getElementById('create-room-form');
const errorMessage = document.getElementById('error-message');
const roomsContainer = document.querySelector('.rooms-container');
const roomsMessage = document.querySelector('.rooms-message');
const userNameModal = document.querySelector('.username-modal');
const userNameForm = document.getElementById('username-form');
const cancelUserNameSelection = document.querySelector(".cancel-username");

let selectedRoom = null;

const socket = io('//:3000');

socket.on('room-created', addRoom);

socket.on('room-closed', removeRoom);

createRoomForm.addEventListener('submit', async e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const roomName = form.get('room-name');
  try {
    const response = await fetch(`/rooms/${roomName}`, {
      method: 'POST'
    })
    if(!response.ok && response.status === 409) {
      errorMessage.textContent = "This room already exists";
      createRoomForm.reset();
      return;
    }
  } catch(err) {
    console.error(err);
  }
})

userNameForm.addEventListener('submit', e => {
  e.preventDefault();
  // const form = new FormData(e.target);
  // const userName = form.get('username');
  e.target.action = `/rooms/${selectedRoom}`;
  console.dir(e.target);
  e.target.submit();
  // e.target.submit();
  // window.location.replace(`/${selectedRoom}/?username=${userName}`)
  // try {
  //   const response = await fetch(`/${selectedRoom}?username=${userName}`)
  // } catch(err) {
  //   console.error(err);
  // }
})

cancelUserNameSelection.addEventListener('click', () => {
  userNameModal.classList.add('hidden');
  selectedRoom = null;
})

roomsContainer.addEventListener('click', e => {
  const room = e.target;
  if(room.className !== 'room') return;
  selectedRoom = room.textContent.trim();
  userNameModal.classList.remove('hidden');
})

function addRoom( {roomName} ) {
  console.log("firing")
  if(roomsMessage) {
    roomsMessage.remove();
  }
  const room = document.createElement('div');
  room.className = "room";
  room.textContent = roomName;
  roomsContainer.appendChild(room);
}

function removeRoom(roomName) {
  const roomList = Array.from(roomsContainer.children);

  const room = roomList.find(r => r.innerText === roomName);
  room.remove();
}
