const express = require('express');
const socketio = require('socket.io');
const app = express();
const desCrypto = require('simple-des-crypto'); // Updated package
const CryptoJS = require('crypto-js');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render("index");
});

const server = app.listen(process.env.POST || 3000, () => {
  console.log("Server is running...");
});

// Initialize socket for the server
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.username = "User1";
  socket.desKey = "123456789"; // Replace with your DES key (must be 8 characters)

  socket.on("change_username", (data) => {
    socket.username = data.username;
  });

  // Handle the new message event
  socket.on("new_message", (data) => {
    console.log("New message");

    // Encrypt the message using DES
    const encryptedMessage = CryptoJS.DES.encrypt(data.message, socket.desKey).toString();

    io.sockets.emit("receive_message", {
      message: encryptedMessage,
      username: socket.username
    });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});
