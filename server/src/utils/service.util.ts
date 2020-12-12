import { Game } from '../models/game';
import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';

export { emitAccountChanges };

function emitAccountChanges(game: Game, room: string, io: Server): void {
  io.in(room).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  game.activeTeams.forEach(team => {
    if (team.ableToPlay()) {
      io.in(room).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, {
        auctionAmount: team.auctionAmount
      });
      io.in(room).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, {
        accountBalance: team.accountBalance
      });
    }
  });
}