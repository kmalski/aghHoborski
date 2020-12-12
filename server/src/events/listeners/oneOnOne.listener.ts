import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';
import { OneOnOneService } from '../../services/oneOnOne.service';

export { OneOnOneListener };

class OneOnOneListener extends EventListener {
  private static SERVICE: OneOnOneService = new OneOnOneService();

  static listen(io: Server, socket: ClashSocket): void {
    socket.on(Incoming.GET_ONE_ON_ONE_STATE, () => this.SERVICE.getOneOnOneState(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket): void {
    socket.on(Incoming.START_ONE_ON_ONE, () => this.SERVICE.startOneOnOne(socket, io));
    socket.on(Incoming.CHANGE_CATEGORY_STATE, data => this.SERVICE.changeCategoryState(data, socket, io));
    socket.on(Incoming.CONFIRM_CATEGORY, () => this.SERVICE.confirmCategory(socket, io));
    socket.on(Incoming.CHOOSE_TEAM, data => this.SERVICE.chooseTeam(data, socket, io));
  }
}
