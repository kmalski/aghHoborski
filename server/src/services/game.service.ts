import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Outgoing } from '../constans/event.constants';
import { QuestionSet } from '../models/question.model';
import { Game, GameData } from '../models/game.model';

export {
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
  discardHintAmount
};

function getGameState(socket: UserSocket) {
  const game = socket.room.game;

  socket.emit(Outgoing.GAME_STATE, {
    roundStage: game.roundStage,
    roundNumber: game.roundNumber,
    moneyPool: game.moneyPool,
    hintAmount: game.hintAmount
  });
}

function getGameSettings(socket: UserSocket, io: Server) {
  const roomName = socket.room.name;
  const peopleInRoom = io.sockets.adapter.rooms[roomName].length;
  const questionSetName = socket.room.questions ? socket.room.questions.name : 'Nie wybrano';

  socket.emit(Outgoing.GAME_SETTINGS, [
    { name: 'Nazwa pokoju', value: roomName },
    { name: 'Ilość osób w pokoju', value: peopleInRoom },
    { name: 'Nazwa puli pytań', value: questionSetName }
  ]);
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

function changeHintAmount(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!Number.isInteger(gameData.newHintAmount)) {
    socket.emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana kwoty licytacji podpowiedzi na ${gameData.newHintAmount} nie jest dozwolona.`
    );
  }

  game.hintAmount = gameData.newHintAmount;
  io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
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

  if (!game.isAnswering()) {
    return socket.emit(Outgoing.WARNING, 'Operacja możliwa do wykonania jedynie w fazie pytań.');
  }

  game.correctAnswer();

  io.in(socket.room.name).emit(Outgoing.CORRECT_ANSWER);
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  emitAuctionAmountChanged(game, socket.room.name, io);
}

function markWrongAnswer(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!game.isAnswering()) {
    return socket.emit(Outgoing.WARNING, 'Operacja możliwa do wykonania jedynie w fazie pytań.');
  }

  game.wrongAnswer();

  io.in(socket.room.name).emit(Outgoing.WRONG_ANSWER);
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  emitAuctionAmountChanged(game, socket.room.name, io);
}

function startHintAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!game.isAnswering() || game.isHintAuction()) {
    return socket.emit(Outgoing.WARNING, 'Nie można rozpocząć licytacji o podpowiedź.');
  }

  if (game.auctionWinningTeam.accountBalance <= 0) {
    return socket.emit(Outgoing.WARNING, 'Odpowiadający zespół nie ma już pieniędzy.');
  }

  game.startHintAuction();

  io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_STARTED, { hintAmount: game.hintAmount });
}

function acceptHintAmount(socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const team = game.auctionWinningTeam;

  game.acceptHintAuction();

  io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_FINISHED);
  io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.hintsCount });
  io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
}

function discardHintAmount(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  game.discardHintAuction();

  io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_FINISHED);
  io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
}

function emitAuctionAmountChanged(game: Game, room: string, io: Server) {
  game.activeTeams.forEach(team => {
    io.in(room).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  });
}
