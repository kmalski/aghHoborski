import { Server } from 'socket.io';
import { ClashSocket } from '../../utils/socket.util';

export { EventListener };

abstract class EventListener {
  static listen(io: Server, socket: ClashSocket): void {}
  static listenAdmin(io: Server, socket: ClashSocket): void {}
}
