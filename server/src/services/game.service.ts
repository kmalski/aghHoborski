import { Server } from 'socket.io';
import { Game } from '../models/game';
import { Outgoing } from '../events/event.constants';
import { ClashSocket } from '../utils/socket.util';

export { GameService, GameData };

interface GameData {
  newMoneyPool?: number;
}

class GameService {
  static getGameState(socket: ClashSocket) {
    const game = socket.room.game;

    socket.emit(Outgoing.GAME_STATE, {
      roundStage: game.roundStage,
      roundNumber: game.roundNumber,
      stageNumber: game.stageNumber,
      moneyPool: game.moneyPool,
      hintAmount: game.hintAmount
    });
  }

  static getGameSettings(socket: ClashSocket, io: Server) {
    const roomName = socket.room.name;
    const peopleInRoom = io.sockets.adapter.rooms[roomName].length;
    const questionSetName = socket.room.questions ? socket.room.questions.name : 'Nie wybrano';

    socket.emit(Outgoing.GAME_SETTINGS, [
      { name: 'Nazwa pokoju', value: roomName },
      { name: 'Ilość osób w pokoju', value: peopleInRoom },
      { name: 'Nazwa puli pytań', value: questionSetName }
    ]);
  }

  static resetGame(socket: ClashSocket, io: Server) {
    socket.room.game = new Game();
    if (socket.room.questions) {
      socket.room.questions.reset();
    }

    io.in(socket.room.name).emit(Outgoing.GAME_RESET);
  }

  static changeMoneyPool(gameData: GameData, socket: ClashSocket, io: Server) {
    const game = socket.room.game;

    if (!Number.isInteger(gameData.newMoneyPool)) {
      socket.emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      return socket.emit(Outgoing.WARNING, `Zmiana puli licytacji na ${gameData.newMoneyPool} nie jest dozwolona.`);
    }

    game.moneyPool = gameData.newMoneyPool;
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  }

  static markCorrectAnswer(socket: ClashSocket, io: Server) {
    const game = socket.room.game;
    const team = game.auctionWinningTeam;

    if (!game.isAnswering()) {
      return socket.emit(Outgoing.WARNING, 'Operacja możliwa do wykonania jedynie w fazie pytań.');
    }

    game.correctAnswer();

    io.in(socket.room.name).emit(Outgoing.CORRECT_ANSWER);
    io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    GameService.emitAuctionAmountChanged(game, socket.room.name, io);
  }

  static markWrongAnswer(socket: ClashSocket, io: Server) {
    const game = socket.room.game;

    if (!game.isAnswering()) {
      return socket.emit(Outgoing.WARNING, 'Operacja możliwa do wykonania jedynie w fazie pytań.');
    }

    game.wrongAnswer();

    io.in(socket.room.name).emit(Outgoing.WRONG_ANSWER);
    io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    this.emitAuctionAmountChanged(game, socket.room.name, io);
  }

  static startSecondStage(socket: ClashSocket, io: Server) {
    const game = socket.room.game;

    if (!game.isIdle() || game.roundNumber === 2) {
      return socket.emit(Outgoing.WARNING, 'Nie można teraz rozpocząć drugiego etapu.');
    }

    if (game.getAbleToPlaySize() < 1) {
      return socket.emit(Outgoing.WARNING, 'Pierwszy etap nie ma zespołu, który wygrywa.');
    }

    game.startSecondStage();

    io.in(socket.room.name).emit(Outgoing.SECOND_STAGE_STARTED);
    game.activeTeams.forEach(team => {
      io.in(socket.room.name).emit(team.name + Outgoing.TEAM_STATUS_CHANGED, { isInGame: true });
      io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, {
        accountBalance: team.accountBalance
      });
    });
    game.inactiveTeams.forEach(team => {
      io.in(socket.room.name).emit(team.name + Outgoing.TEAM_STATUS_CHANGED, { isInGame: false });
    });
  }

  private static emitAuctionAmountChanged(game: Game, room: string, io: Server) {
    game.activeTeams.forEach(team => {
      io.in(room).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
    });
  }
}
