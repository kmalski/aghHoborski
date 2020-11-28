import { Server } from 'socket.io';
import { ClashSocket } from '../../utils/socket.util';

export { EventListener, Options };

interface Options {
  useDatabase: boolean;
}

abstract class EventListener {
  static configure(options: Options): void {}
  static listen(io: Server, socket: ClashSocket): void {}
  static listenAdmin(io: Server, socket: ClashSocket): void {}
}
