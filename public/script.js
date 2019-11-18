const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt('What is your name?');
appendMessage('연결하셨습니다.');
socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${getDate()} ${data.name}님 : ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${getDate()} ${name}님이 연결했습니다.`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${getDate()} ${name}님이 나갔습니다.`);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`${getDate()} 당신 : ${message}`);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function getDate() {
  const now = new Date();
  return `[${now.getHours()}시 ${now.getMinutes()}분 ${now.getSeconds()}초]`;
}
