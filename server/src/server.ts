import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import SocketIO from 'socket.io';
import { AddressInfo } from 'net';

import { Incoming } from './events/event.constants';
import { ClashSocket } from './utils/socket.util';
import { Logger } from './utils/logger';
import { RoomListener } from './events/listeners/room.listener';

export { ClashServer };

dotenv.config();

class ClashServer {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private readonly io: SocketIO.Server;
  private port: number;
  private useDatabase = false;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = SocketIO(this.server, { serveClient: false });
  }

  async start(port?: number): Promise<void> {
    this.configure();
    if (port) {
      await this.listen(port);
      this.port = port;
    } else {
      await this.listen(0);
      this.port = (this.server.address() as AddressInfo).port;
    }
    if (!this.useDatabase) Logger.info('Starting without MongoDB');
    Logger.info(`Server listening at port ${this.port}`);
  }

  async stop(): Promise<void> {
    await this.close();
  }

  async connectMongo(uri: string): Promise<void> {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
    this.useDatabase = true;
    Logger.info('Connected to MongoDB');
  }

  async disconnectMongo(): Promise<void> {
    if (this.useDatabase) await mongoose.disconnect();
  }

  getPort(): number {
    return this.port;
  }

  private configure() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());

    this.io.on(Incoming.CONNECT, (socket: ClashSocket) => {
      Logger.info(`New user connected: ${socket.id}`);

      RoomListener.configure({ useDatabase: this.useDatabase });
      RoomListener.listen(this.io, socket);
    });

    this.app.use((req: Request, res: Response) => {
      res.status(404).sendFile(path.join(__dirname, '../../public/index.html'));
    });
  }

  private async listen(port: number) {
    return new Promise<void>(resolve => this.server.listen(port, () => resolve()));
  }

  private async close() {
    return new Promise<void>(resolve => this.server.close(() => resolve()));
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
      .catch((err: Error) => Logger.error(err));
  } else {
    server.start(port).catch((err: Error) => Logger.error(err));
  }
}
