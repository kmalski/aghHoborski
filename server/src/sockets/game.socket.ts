import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../constans/event.constants';
import {
  getGameState,
  getGameSettings,
  resetGame,
  changeMoneyPool,
  changeHintAmount,
  startAuction,
  finishAuction,
  cancelAuction,
  markCorrectAnswer,
  markWrongAnswer,
  startHintAuction,
  acceptHintAmount,
  discardHintAmount,
  startSecondStage
} from '../services/game.service';

export { listen, listenAdmin };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_GAME_STATE, () => getGameState(socket));
}

function listenAdmin(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_GAME_SETTINGS, () => getGameSettings(socket, io));
  socket.on(Incoming.RESET_GAME, () => resetGame(socket, io));
  socket.on(Incoming.CHANGE_MONEY_POOL, gameData => changeMoneyPool(gameData, socket, io));
  socket.on(Incoming.CHANGE_HINT_AMOUNT, gameData => changeHintAmount(gameData, socket, io));
  socket.on(Incoming.START_AUCTION, gameData => startAuction(gameData, socket, io));
  socket.on(Incoming.FINISH_AUCTION, () => finishAuction(socket, io));
  socket.on(Incoming.CANCEL_AUCTION, () => cancelAuction(socket, io));
  socket.on(Incoming.MARK_CORRECT_ANSWER, () => markCorrectAnswer(socket, io));
  socket.on(Incoming.MARK_WRONG_ANSWER, () => markWrongAnswer(socket, io));
  socket.on(Incoming.START_HINT_AUCTION, () => startHintAuction(socket, io));
  socket.on(Incoming.ACCEPT_HINT_AMOUNT, () => acceptHintAmount(socket, io));
  socket.on(Incoming.DISCARD_HINT_AMOUNT, () => discardHintAmount(socket, io));
  socket.on(Incoming.START_SECOND_STAGE, () => startSecondStage(socket, io));
}
