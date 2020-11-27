import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { ClashSocket } from '../../utils/socket.util';
import { normalizeString } from '../../utils';
import { RoomService, RoomData } from '../../services/room.service';
import { EventListener } from './event.listener';

export { RoomListener };

class RoomListener extends EventListener {
  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.CREATE_ROOM, roomData => RoomService.create(this.normalize(roomData), socket));
    socket.on(Incoming.JOIN_ROOM, roomData => RoomService.join(this.normalize(roomData), socket, io));
    socket.on(Incoming.AUTHORIZE, roomData => RoomService.authorize(this.normalize(roomData), socket, io));
    socket.on(Incoming.ADMIN_JOIN_ROOM, roomData => RoomService.adminJoin(this.normalize(roomData), socket));
  }

  private static normalize(roomData: RoomData): RoomData {
    roomData.name = normalizeString(roomData.name);
    return roomData;
  }
}
