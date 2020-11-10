import { Server } from 'socket.io';
import { RoomShared } from '../models/room.model';
import { Incoming } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { normalizeString } from '../utils';
import { join, create, adminJoin, authorize } from '../services/room.service';

export { listen };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.CREATE_ROOM, roomData => create(normalize(roomData), socket));
  socket.on(Incoming.JOIN_ROOM, roomData => join(normalize(roomData), socket, io));
  socket.on(Incoming.ADMIN_JOIN_ROOM, roomData => adminJoin(normalize(roomData), socket));
  socket.on(Incoming.AUTHORIZE, roomData => authorize(normalize(roomData), socket, io));
}

function normalize(roomData: RoomShared): RoomShared {
  roomData.name = normalizeString(roomData.name);
  return roomData;
}
