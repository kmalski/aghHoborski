import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Outgoing } from '../constans/event.constants';
import { QuestionSet } from '../models/question.model';
import { Game, GameData } from '../models/game.model';

export {
  getGameState,
  getMoneyPool,
  resetGame,
  changeMoneyPool,
  startAuction,
  finishAuction,
  cancelAuction,
  markCorrectAnswer,
  markWrongAnswer
};

function getGameState(socket: UserSocket) {
  const game = socket.room.game;

  socket.emit(Outgoing.GAME_STATE, {
    roundStage: game.roundStage
  });
}

function getMoneyPool(socket: UserSocket) {
  const game = socket.room.game;

  socket.emit(Outgoing.MONEY_POOL, { moneyPool: game.moneyPool });
}

function resetGame(socket: UserSocket, io: Server) {
  socket.room.game = new Game();
  if (socket.room.questions) {
    socket.room.questions.reset();
  }

  io.in(socket.room.name).emit(Outgoing.GAME_RESET);
}

function changeMoneyPool(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!Number.isInteger(gameData.newMoneyPool)) {
    socket.emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    return socket.emit(Outgoing.WARNING, `Zmiana puli licytacji na ${gameData.newMoneyPool} nie jest dozwolona.`);
  }

  game.moneyPool = gameData.newMoneyPool;
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
}

function startAuction(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const questions = socket.room.questions;

  if (!game.isIdle() || game.getAbleToPlaySize() < 2 || !gameData.categoryName) {
    return socket.emit(Outgoing.FAIL, 'Nie można rozpocząć licytacji.');
  }

  if (!questions || !questions.categoryExists(gameData.categoryName)) {
    return socket.emit(Outgoing.FAIL, 'Podana kategoria nie istnieje.');
  }

  questions.setCategory(gameData.categoryName);
  game.startAuction();

  socket.emit(Outgoing.SUCCESS);
  io.in(socket.room.name).emit(Outgoing.AUCTION_STARTED, {
    category: questions.current.category,
    roundNumber: game.roundNumber
  });
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  game.activeTeams.forEach(team => {
    if (team.ableToPlay()) {
      io.in(socket.room.name).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
      io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, {
        accountBalance: team.accountBalance
      });
    }
  });
}

function finishAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const questions = socket.room.questions;

  if (!game.isAuction() || !game.auctionWinningTeam) {
    return socket.emit(Outgoing.WARNING, 'Nie można zakończyć licytacji.');
  }

  const team = game.finishAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED, { winningTeam: team.name });
  if (!team.ableToPlay()) {
    io.in(socket.room.name).emit(team.name + Outgoing.HAS_LOST_CHANGED, { hasLost: true });
  }

  switch (questions.current.category) {
    case QuestionSet.BLACK_BOX_CATEGORY:
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      io.in(socket.room.name).emit(team.name + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: team.grantBlackBox() });
      emitAuctionAmountChanged(game, socket.room.name, io);
      break;
    case QuestionSet.HINT_CATEGORY:
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.grantHint() });
      emitAuctionAmountChanged(game, socket.room.name, io);
      break;
    default:
      const question = questions.drawQuestion();
      io.in(socket.room.name).emit(Outgoing.NEXT_QUESTION, {
        category: questions.current.category,
        question: question.content,
        hints: question.hints
      });
      break;
  }
}

function cancelAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!game.isAuction()) {
    return socket.emit(Outgoing.WARNING, 'Nie można anulować licytacji.');
  }

  socket.room.questions.current.category = null;
  game.cancelAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED, { winningTeam: null });
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  game.activeTeams.forEach(team => {
    io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    io.in(socket.room.name).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  });
}

function markCorrectAnswer(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  const team = game.auctionWinningTeam;
  game.correctAnswer();

  io.in(socket.room.name).emit(Outgoing.CORRECT_ANSWER);
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  emitAuctionAmountChanged(game, socket.room.name, io);
}

function markWrongAnswer(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  game.wrongAnswer();

  io.in(socket.room.name).emit(Outgoing.WRONG_ANSWER);
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  emitAuctionAmountChanged(game, socket.room.name, io);
}

function emitAuctionAmountChanged(game: Game, room: string, io: Server) {
  game.activeTeams.forEach(team => {
    io.in(room).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  });
}
