import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import SocketIO from 'socket.io';
import { AddressInfo } from 'net';

import { Incoming } from './events/event.constants';
import { ClashSocket } from './utils/socket.util';
import { RoomListener } from './events/listeners/room.listener';

export { ClashServer };

dotenv.config();

class ClashServer {
  private app: express.Application;
  private server: http.Server;
  private io: SocketIO.Server;
  private port: number;
  private useDatabase: boolean = false;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = SocketIO(this.server, { serveClient: false });
  }

  async start(port?: number) {
    this.configure();
    if (port) {
      await this.listen(port);
      this.port = port;
    } else {
      await this.listen(0);
      this.port = (this.server.address() as AddressInfo).port;
    }
    if (!this.useDatabase) console.log('[INFO] Starting without MongoDB');
    console.log(`[INFO] Server listening at port ${this.port}`);
  }

  async stop() {
    await this.close();
  }

  async connectMongo(uri: string) {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
    this.useDatabase = true;
    console.log('[INFO] Connected to MongoDB');
  }

  async disconnectMongo() {
    if (this.useDatabase) await mongoose.disconnect();
  }

  getPort() {
    return this.port;
  }

  private configure() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());

    this.io.on(Incoming.CONNECT, (socket: ClashSocket) => {
      console.log(`New user connected: ${socket.id}`);

      RoomListener.configure({ useDatabase: this.useDatabase });
      RoomListener.listen(this.io, socket);
    });

    this.app.use((_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).sendFile(path.join(__dirname, '/../public/index.html'));
    });
  }

  private async listen(port: number) {
    return new Promise(resolve => this.server.listen(port, () => resolve()));
  }

  private async close() {
    return new Promise(resolve => this.server.close(() => resolve()));
  }
}

if (require.main === module) {
  const server = new ClashServer();
  const port = parseInt(process.env.SERVER_PORT);
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    server
      .connectMongo(mongoUri)
      .then(() => server.start(port))
      .catch((err: Error) => console.log(new Date(), err));
  } else {
    server.start(port).catch((err: Error) => console.log(new Date(), err));
  }
}
