import { Socket } from 'socket.io';
import { Room } from '../models/room';

export { ClashSocket };

interface ClashSocket extends Socket {
  room: Room;
}
