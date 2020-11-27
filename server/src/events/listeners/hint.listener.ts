import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { HintService } from '../../services/hint.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { HintListener };

class HintListener extends EventListener {
  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_HINT_AUCTION, () => HintService.startHintAuction(socket, io));
    socket.on(Incoming.ACCEPT_HINT_AMOUNT, () => HintService.acceptHintAmount(socket, io));
    socket.on(Incoming.DISCARD_HINT_AMOUNT, () => HintService.discardHintAmount(socket, io));
    socket.on(Incoming.CHANGE_HINT_AMOUNT, gameData => HintService.changeHintAmount(gameData, socket, io));
    socket.on(Incoming.USE_HINT, () => HintService.useHint(socket, io));
  }
}
