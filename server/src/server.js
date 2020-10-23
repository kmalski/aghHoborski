require('dotenv').config();
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const path = require('path');

const port = process.env.SERVER_PORT || 2222;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const room = require('./sockets/room');
const io = socket(server, { serveClient: false });

io.on('connect', socket => {
  console.log(`New user connected: ${socket.id}`);
  room.listen(io, socket);
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '/../public/index.html'));
});

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
