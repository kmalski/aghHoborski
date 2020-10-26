import { Socket } from 'socket.io';
import { RoomInternal } from '../models/room.model';

export { UserSocket };

interface UserSocket extends Socket {
  room: RoomInternal;
}
