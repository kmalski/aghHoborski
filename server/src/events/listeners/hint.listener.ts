import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { HintService } from '../../services/hint.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { HintListener };

class HintListener extends EventListener {
  private static SERVICE: HintService = new HintService();

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_HINT_AUCTION, () => this.SERVICE.startHintAuction(socket, io));
    socket.on(Incoming.ACCEPT_HINT_AMOUNT, () => this.SERVICE.acceptHintAmount(socket, io));
    socket.on(Incoming.DISCARD_HINT_AMOUNT, () => this.SERVICE.discardHintAmount(socket, io));
    socket.on(Incoming.CHANGE_HINT_AMOUNT, gameData => this.SERVICE.changeHintAmount(gameData, socket, io));
    socket.on(Incoming.USE_HINT, () => this.SERVICE.useHint(socket, io));
  }
}
