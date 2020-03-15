const createRoomForm = document.getElementById('create-room-form');
const errorMessage = document.getElementById('error-message');

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
  } catch(err) {
    console.error(err);
  }
})
