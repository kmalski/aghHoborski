import { Server } from 'socket.io';
import { GameData } from '../models/game.model';
import { UserSocket } from '../utils/socket.utils';
import { TeamName, TeamShared } from '../models/team.model';
import { Outgoing } from '../utils/event.constants';
import { drawNextQuestion } from './question.service';

export {
  getTeamState,
  getMoneyPool,
  changeBlackBox,
  changeTeamStatus,
  changeAuctionAmount,
  changeAccountBalance,
  changeHintsCount,
  changeMoneyPool,
  resetAccountBalances,
  startAuction,
  finishAuction,
  cancelAuction
};

function getTeamState(gameData: GameData, socket: UserSocket) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.exists(teamName)) {
    return socket.emit(teamName + Outgoing.TEAM_STATE);
  }

  const team = game.getTeam(teamName);
  const teamShared = team as TeamShared;
  teamShared.isInGame = game.isInGame(teamName);
  teamShared.isAuction = game.isAuction;
  teamShared.hasLost = !team.ableToPlay();

  socket.emit(teamName + Outgoing.TEAM_STATE, teamShared);
}

function getMoneyPool(socket: UserSocket) {
  const game = socket.room.game;

  socket.emit(Outgoing.MONEY_POOL, { moneyPool: game.moneyPool });
}

function changeTeamStatus(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (
    game.isAuction ||
    game.isAnsweringStage() ||
    !game.exists(teamName) ||
    typeof gameData.newIsInGame !== 'boolean' ||
    game.isInGame(teamName) === gameData.newIsInGame
  ) {
    return socket.emit(Outgoing.WARNING, 'Zmiana statusu drużyny jest w tym momencie niedozwolona.');
  }

  game.changeTeamStatus(teamName, gameData.newIsInGame);

  io.in(socket.room.name).emit(teamName + Outgoing.TEAM_STATUS_CHANGED, { isInGame: gameData.newIsInGame });
}

function changeAuctionAmount(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (
    !Number.isInteger(gameData.newAuctionAmount) ||
    !game.isAuction ||
    !game.isInGame(teamName) ||
    !game.bidAmount(teamName, gameData.newAuctionAmount)
  ) {
    socket.emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: game.getTeam(teamName).auctionAmount });
    return socket.emit(
      Outgoing.WARNING,
      `Licytacja kwoty ${gameData.newAuctionAmount} jest w tym momencie niedozwolona.`
    );
  }

  const team = game.activeTeams.get(teamName);
  io.in(socket.room.name).emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
}

function changeAccountBalance(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!Number.isInteger(gameData.newAccountBalance) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
      accountBalance: game.getTeam(teamName).accountBalance
    });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana stanu konta na ${gameData.newAccountBalance} jest w tym momencie niedozwolona.`
    );
  }

  const team = game.getActiveTeam(teamName);
  team.accountBalance = gameData.newAccountBalance;

  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
    accountBalance: team.accountBalance,
    hasLost: !team.ableToPlay()
  });
}

function changeHintsCount(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!Number.isInteger(gameData.newHintsCount) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { hintsCount: game.getTeam(teamName).hintsCount });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana ilości podpowiedzi na ${gameData.newHintsCount} jest w tym momencie niedozwolona.`
    );
  }

  game.getActiveTeam(teamName).hintsCount = gameData.newHintsCount;
  io.in(socket.room.name).emit(teamName + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: gameData.newHintsCount });
}

function changeBlackBox(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.isInGame(teamName) || typeof gameData.newHasBlackBox !== 'boolean') {
    return socket.emit(Outgoing.WARNING, 'Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
  }

  game.getActiveTeam(teamName).hasBlackBox = gameData.newHasBlackBox;
  io.in(socket.room.name).emit(teamName + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: gameData.newHasBlackBox });
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

function resetAccountBalances(gameData: GameData, socket: UserSocket) {
  const game = socket.room.game;

  if (!Number.isInteger(gameData.newAccountBalance)) {
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana wszystkich stanów kont na ${gameData.newAccountBalance} nie jest dozwolona.`
    );
  }

  game.activeTeams.forEach(team => {
    team.accountBalance = gameData.newAccountBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
  game.inactiveTeams.forEach(team => {
    team.accountBalance = gameData.newAccountBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
}

function startAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (game.isAuction === true || game.getAbleToPlaySize() < 2) {
    return socket.emit(Outgoing.WARNING, 'Nie można rozpocząć aukcji.');
  }

  game.startAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_STARTED);
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

function finishAuction(gameData: GameData, socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (game.isAuction === false || !gameData.auctionFinishAction || !game.auctionWinningTeam) {
    if (gameData.categoryName) {
      return socket.emit(Outgoing.FAIL, 'Nie można zakończyć aukcji.');
    }
    return socket.emit(Outgoing.WARNING, 'Nie można zakończyć aukcji.');
  }

  const team = game.finishAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED);
  if (!team.ableToPlay()) {
    io.in(socket.room.name).emit(team.name + Outgoing.HAS_LOST_CHANGED, { hasLost: true });
  }
  switch (gameData.auctionFinishAction) {
    case 'grantBlackBox':
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      return io
        .in(socket.room.name)
        .emit(team.name + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: team.grantBlackBox() });
    case 'grantHint':
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      return io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.grantHint() });
    case 'drawNextQuestion':
      return drawNextQuestion({ categoryName: gameData.categoryName }, socket, io);
    default:
      return socket.emit(Outgoing.WARNING, 'Nieznana akcja.');
  }
}

function cancelAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (game.isAuction === false) {
    return socket.emit(Outgoing.WARNING, 'Nie można anulować aukcji.');
  }

  game.cancelAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED);
  io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  game.activeTeams.forEach(team => {
    io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
}
