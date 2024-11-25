// Connect to the WebSocket server
const socket = io('https://your-websocket-server-url.com'); // Replace this with your WebSocket server URL (Heroku, AWS, etc.)

// Get references to DOM elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatArea = document.getElementById('chat-area');

// Function to handle sending messages
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-message', message);
        messageInput.value = '';  // Clear the input
    }
});

// Listen for incoming messages from the server
socket.on('receive-message', (messageData) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${messageData.username}: ${messageData.message}`;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;  // Scroll to the bottom
});

// You can also add code to handle new user connections and display user avatars
