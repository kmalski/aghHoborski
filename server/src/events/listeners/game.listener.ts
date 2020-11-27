import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { ClashSocket } from '../../utils/socket.util';
import { GameService } from '../../services/game.service';
import { EventListener } from '../listeners/event.listener';

export { GameListener };

class GameListener extends EventListener {
  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_GAME_STATE, () => GameService.getGameState(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_GAME_SETTINGS, () => GameService.getGameSettings(socket, io));
    socket.on(Incoming.RESET_GAME, () => GameService.resetGame(socket, io));
    socket.on(Incoming.CHANGE_MONEY_POOL, gameData => GameService.changeMoneyPool(gameData, socket, io));
    socket.on(Incoming.MARK_CORRECT_ANSWER, () => GameService.markCorrectAnswer(socket, io));
    socket.on(Incoming.MARK_WRONG_ANSWER, () => GameService.markWrongAnswer(socket, io));
    socket.on(Incoming.START_SECOND_STAGE, () => GameService.startSecondStage(socket, io));
  }
}
