const createRoomForm = document.getElementById('create-room-form');
const errorMessage = document.getElementById('error-message');
const roomsContainer = document.querySelector('.rooms-container');

createRoomForm.addEventListener('submit', async e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const roomName = form.get('room-name');
  try {
    const response = await fetch(`/${roomName}`, {
      method: 'POST'
    })
    if(!response.ok && response.status === 409) {
      errorMessage.textContent = "This room already exists";
      createRoomForm.reset();
      return;
    }
    const parsedResponse = await response.json();
    if(parsedResponse.success) {
      addRoom(parsedResponse.roomName);
    }
  } catch(err) {
    console.error(err);
  }
})

function addRoom(roomName) {
  const room = document.createElement('div');
  room.className = "room";
  const anchor = document.createElement('a');
  anchor.href = `/${roomName}`;
  anchor.textContent = roomName;
  room.appendChild(anchor);
  roomsContainer.appendChild(room);
}
