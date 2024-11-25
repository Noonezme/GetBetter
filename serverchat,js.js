const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (if needed)
app.use(express.static('public'));

// Handle incoming WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for messages from clients
    socket.on('send-message', (message) => {
        io.emit('receive-message', { username: 'User', message: message });
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
