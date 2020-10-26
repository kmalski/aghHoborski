require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';

import * as room from './sockets/room.socket';
import { UserSocket } from './utils/socket.utils';
import { Incoming } from './utils/event.constants';

const port = process.env.SERVER_PORT || 2222;
const connectionString = process.env.MONGODB_URI;

const app = express();
const server = http.createServer(app);
const io = socketio(server, { serveClient: false });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

io.on(Incoming.CONNECT, (socket: UserSocket) => {
  console.log(`New user connected: ${socket.id}`);
  
  room.listen(io, socket);
});

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).sendFile(path.join(__dirname, '/../public/index.html'));
});

mongoose
  .connect(connectionString, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    server.listen(port, () => console.log(`Server listening at port ${port}`));
  })
  .catch((err: Error) => {
    console.log(err);
  });
