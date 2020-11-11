import { Socket } from 'socket.io';
import { Room } from '../models/room.model';

export { UserSocket };

interface UserSocket extends Socket {
  room: Room;
}
