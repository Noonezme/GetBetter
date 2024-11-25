const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (e.g., images, CSS, JS)
app.use(express.static('public'));

// MongoDB connection (you can replace this with your DB URI)
mongoose.connect('mongodb://localhost/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User schema for MongoDB (used to store usernames and emails)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

// Store connected users in memory (for simplicity)
let onlineUsers = [];

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        const { username, email } = data;
        
        // Add user to online list
        onlineUsers.push({ username, email });
        io.emit('online-users', onlineUsers);

        // Store user in database (you could use this to check if email exists)
        const newUser = new User({ username, email });
        newUser.save().catch(err => console.error('Error saving user:', err));
    });

    socket.on('send-message', (data) => {
        const { message, username, email } = data;
        // Emit the message to all clients
        io.emit('chat-message', { message, username, email });
    });

    socket.on('disconnect', () => {
        // Remove the user from online list when they disconnect
        onlineUsers = onlineUsers.filter(user => user.email !== socket.email);
        io.emit('online-users', onlineUsers);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
