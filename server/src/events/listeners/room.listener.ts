import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { ClashSocket } from '../../utils/socket.util';
import { normalizeString } from '../../utils';
import { RoomService, LocalRoomService, RoomData } from '../../services/room.service';
import { EventListener, Options } from './event.listener';
import {Logger} from "../../utils/logger";

export { RoomListener };

class RoomListener extends EventListener {
  private static SERVICE: RoomService;

  static configure(options: Options): void {
    if (options.useDatabase) {
      Logger.info('Configuring Room Service in online mode.')
      this.SERVICE = new RoomService();
    } else {
      Logger.info('Configuring Room Service in offline mode.')
      this.SERVICE = new LocalRoomService();
    }
  }

  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.CREATE_ROOM, roomData => this.SERVICE.create(this.normalize(roomData), socket));
    socket.on(Incoming.JOIN_ROOM, roomData => this.SERVICE.join(this.normalize(roomData), socket, io));
    socket.on(Incoming.AUTHORIZE, roomData => this.SERVICE.authorize(this.normalize(roomData), socket, io));
    socket.on(Incoming.ADMIN_JOIN_ROOM, roomData => this.SERVICE.adminJoin(this.normalize(roomData), socket));
  }

  private static normalize(roomData: RoomData): RoomData {
    roomData.name = normalizeString(roomData.name);
    return roomData;
  }
}
