import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { TimeService } from '../../services/time.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { TimeListener };

class TimeListener extends EventListener {
  private static SERVICE: TimeService = new TimeService();

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_TIME, timeData => this.SERVICE.startTime(timeData, socket, io));
    socket.on(Incoming.STOP_TIME, () => this.SERVICE.stopTime(socket, io));
  }
}
