const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store private chats in a Map
const privateChats = new Map();

// Serve static files (if needed)
app.use(express.static('public'));

// Handle incoming WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for public chat messages
    socket.on('send-message', (data) => {
        io.emit('receive-message', data); // Broadcast to all users
    });

    // Listen for private chat creation
    socket.on('create-private-chat', (data) => {
        const { username, privateId, privatePassword } = data;
        const chatKey = `${privateId}:${privatePassword}`;
        
        // Check if the private chat already exists
        if (!privateChats.has(chatKey)) {
            privateChats.set(chatKey, []);
        }

        // Join the private chat
        socket.join(chatKey);
        io.to(chatKey).emit('receive-private-message', { username, message: `${username} has joined the private chat.` });
    });

    // Listen for messages in private chat
    socket.on('send-private-message', (data) => {
        const { privateId, privatePassword, message } = data;
        const chatKey = `${privateId}:${privatePassword}`;

        if (privateChats.has(chatKey)) {
            io.to(chatKey).emit('receive-private-message', data);
        } else {
            socket.emit('receive-private-message', { username: 'System', message: 'Private chat not found.' });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
