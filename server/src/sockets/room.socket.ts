import { Server } from 'socket.io';
import { RoomShared } from '../models/room.model';
import { Incoming } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { normalizeString } from '../utils';
import { join, create, adminJoin, getState, adminGetState } from '../services/room.service';

export { listen };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.CREATE_ROOM, room => create(normalize(room), socket));
  socket.on(Incoming.JOIN_ROOM, room => join(normalize(room), socket));
  socket.on(Incoming.ADMIN_JOIN_ROOM, room => adminJoin(normalize(room), socket));
  socket.on(Incoming.GET_STATE, room => getState(normalize(room), socket));
  socket.on(Incoming.ADMIN_GET_STATE, room => adminGetState(normalize(room), socket));
}

function normalize(room: RoomShared): RoomShared {
  room.name = normalizeString(room.name);
  return room;
}
