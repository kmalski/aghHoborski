import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { TimeService } from '../../services/time.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { TimeListener };

class TimeListener extends EventListener {
  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_TIME, timeData => TimeService.startTime(timeData, socket, io));
    socket.on(Incoming.STOP_TIME, () => TimeService.stopTime(socket, io));
  }
}
