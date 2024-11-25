// Establish a connection with the WebSocket server
const socket = io('https://your-websocket-server.herokuapp.com');

// DOM elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatArea = document.getElementById('chat-area');
const usernameSpan = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const privateIdInput = document.getElementById('private-id');
const privatePasswordInput = document.getElementById('private-password');
const createPrivateBtn = document.getElementById('create-private-btn');

let username = prompt("Enter your username:");
usernameSpan.textContent = username;

// Function to display messages
function displayMessage(user, message, privateChat = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(privateChat ? 'private-message' : 'public-message');
    messageElement.textContent = `${user}: ${message}`;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Send a public message
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message && !containsBadWords(message)) {
        socket.emit('send-message', { username, message });
        messageInput.value = ''; // Clear the input field
    }
});

// Send a private message (if in a private chat)
createPrivateBtn.addEventListener('click', () => {
    const privateId = privateIdInput.value.trim();
    const privatePassword = privatePasswordInput.value.trim();
    if (privateId && privatePassword) {
        socket.emit('create-private-chat', { username, privateId, privatePassword });
    }
});

// Listen for incoming public messages
socket.on('receive-message', (messageData) => {
    displayMessage(messageData.username, messageData.message);
});

// Listen for incoming private messages
socket.on('receive-private-message', (messageData) => {
    displayMessage(messageData.username, messageData.message, true);
});

// Logout
logoutBtn.addEventListener('click', () => {
    window.location.reload(); // Reload the page to logout
});

// Function to check for bad words
function containsBadWords(message) {
    const badWords = ["badword1", "badword2", "badword3"]; // Example bad words
    return badWords.some(badWord => message.includes(badWord));
}
