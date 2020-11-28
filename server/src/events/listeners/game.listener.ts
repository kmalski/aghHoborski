import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { ClashSocket } from '../../utils/socket.util';
import { GameService } from '../../services/game.service';
import { EventListener } from '../listeners/event.listener';

export { GameListener };

class GameListener extends EventListener {
  private static SERVICE: GameService = new GameService();

  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_GAME_STATE, () => this.SERVICE.getGameState(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_GAME_SETTINGS, () => this.SERVICE.getGameSettings(socket, io));
    socket.on(Incoming.RESET_GAME, () => this.SERVICE.resetGame(socket, io));
    socket.on(Incoming.CHANGE_MONEY_POOL, gameData => this.SERVICE.changeMoneyPool(gameData, socket, io));
    socket.on(Incoming.MARK_CORRECT_ANSWER, () => this.SERVICE.markCorrectAnswer(socket, io));
    socket.on(Incoming.MARK_WRONG_ANSWER, () => this.SERVICE.markWrongAnswer(socket, io));
    socket.on(Incoming.START_SECOND_STAGE, () => this.SERVICE.startSecondStage(socket, io));
  }
}
