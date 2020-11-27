import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { AuctionService } from '../../services/auction.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { AuctionListener };

class AuctionListener extends EventListener {
  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_AUCTION, gameData => AuctionService.startAuction(gameData, socket, io));
    socket.on(Incoming.FINISH_AUCTION, () => AuctionService.finishAuction(socket, io));
    socket.on(Incoming.CANCEL_AUCTION, () => AuctionService.cancelAuction(socket, io));
  }
}
