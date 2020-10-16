require('dotenv').config();
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const port = process.env.SERVER_PORT || 2222;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const rooms = require('./socket/rooms');

const io = socket(server, { path: '/game', serveClient: false });

io.on('connect', socket => {
  console.log(`New user connected: ${socket.id}`);
  rooms.listen(io, socket);
});

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
