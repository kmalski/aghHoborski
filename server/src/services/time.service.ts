import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Outgoing } from '../constans/event.constants';
import { TimeData } from '../models/time.model';

export { startTime, stopTime };

function startTime(timeData: TimeData, socket: UserSocket, io: Server) {
  if (!timeData || !Number.isInteger(timeData.newValue) || timeData.newValue < 1) {
    return socket.emit(Outgoing.WARNING, 'Błędny czas, nie można rozpocząć odliczania.');
  }
  if (timeData.newValue > 3600) {
    return socket.emit(Outgoing.WARNING, 'W tyle czasu to każdy może zgadnąć, spróbuj troszkę mniej.');
  }

  io.in(socket.room.name).emit(Outgoing.TIME_STARTED, { value: timeData.newValue });
}

function stopTime(socket: UserSocket, io: Server) {
  io.in(socket.room.name).emit(Outgoing.TIME_STOPPED);
}
