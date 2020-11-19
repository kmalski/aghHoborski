import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../constans/event.constants';
import { startTime, stopTime } from '../services/time.service';

export { listenAdmin };

function listenAdmin(io: Server, socket: UserSocket) {
  socket.on(Incoming.START_TIME, timeData => startTime(timeData, socket, io));
  socket.on(Incoming.STOP_TIME, () => stopTime(socket, io));
}
