import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { ClashSocket } from '../utils/socket.util';

export { TimeService, TimeData };

interface TimeData {
  newValue: number; // in seconds
}

class TimeService {
  startTime(data: TimeData, socket: ClashSocket, io: Server) {
    if (!data || !Number.isInteger(data.newValue) || data.newValue < 1) {
      return socket.emit(Outgoing.WARNING, 'Błędny czas, nie można rozpocząć odliczania.');
    }
    if (data.newValue > 3600) {
      return socket.emit(Outgoing.WARNING, 'W tyle czasu to każdy może zgadnąć, spróbuj troszkę mniej.');
    }

    io.in(socket.room.name).emit(Outgoing.TIME_STARTED, { value: data.newValue });
  }

  stopTime(socket: ClashSocket, io: Server) {
    io.in(socket.room.name).emit(Outgoing.TIME_STOPPED);
  }
}
