import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { AuctionService } from '../../services/auction.service';
import { EventListener } from './event.listener';
import { ClashSocket } from '../../utils/socket.util';

export { AuctionListener };

class AuctionListener extends EventListener {
  private static SERVICE: AuctionService = new AuctionService();

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.START_AUCTION, gameData => this.SERVICE.startAuction(gameData, socket, io));
    socket.on(Incoming.FINISH_AUCTION, () => this.SERVICE.finishAuction(socket, io));
    socket.on(Incoming.CANCEL_AUCTION, () => this.SERVICE.cancelAuction(socket, io));
  }
}
