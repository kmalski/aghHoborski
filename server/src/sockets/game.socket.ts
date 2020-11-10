import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../utils/event.constants';
import {
  changeAccountBalance,
  changeAuctionAmount,
  changeBlackBox,
  changeHintsCount,
  changeTeamStatus,
  changeMoneyPool,
  getTeamState,
  startAuction,
  finishAuction,
  cancelAuction,
  getMoneyPool,
  resetAccountBalances
} from '../services/game.service';

export { listen, listenAdmin };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_TEAM_STATE, gameData => getTeamState(gameData, socket));
  socket.on(Incoming.GET_MONEY_POOL, () => getMoneyPool(socket));
}

function listenAdmin(io: Server, socket: UserSocket) {
  socket.on(Incoming.CHANGE_TEAM_STATUS, gameData => changeTeamStatus(gameData, socket, io));
  socket.on(Incoming.CHANGE_AUCTION_AMOUNT, gameData => changeAuctionAmount(gameData, socket, io));
  socket.on(Incoming.CHANGE_ACCOUNT_BALANCE, gameData => changeAccountBalance(gameData, socket, io));
  socket.on(Incoming.CHANGE_HINTS_COUNT, gameData => changeHintsCount(gameData, socket, io));
  socket.on(Incoming.CHANGE_BLACK_BOX, gameData => changeBlackBox(gameData, socket, io));
  socket.on(Incoming.CHANGE_MONEY_POOL, gameData => changeMoneyPool(gameData, socket, io));
  socket.on(Incoming.RESET_ACCOUNT_BALANCES, gameData => resetAccountBalances(gameData, socket));
  socket.on(Incoming.START_AUCTION, () => startAuction(socket, io));
  socket.on(Incoming.FINISH_AUCTION, gameData => finishAuction(gameData, socket, io));
  socket.on(Incoming.CANCEL_AUCTION, () => cancelAuction(socket, io));
}
