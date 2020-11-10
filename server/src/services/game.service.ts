import { Server } from 'socket.io';
import { Game, GameShared } from '../models/game.model';
import { UserSocket } from '../utils/socket.utils';
import { TeamName, TeamShared } from '../models/team.model';
import { Outgoing } from '../utils/event.constants';
import { isBoolean } from 'util';

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

function getTeamState(gameData: GameShared, socket: UserSocket) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.exists(teamName)) {
    return socket.emit(teamName + Outgoing.TEAM_STATE);
  }

  let team: TeamShared;
  if (game.isInGame(teamName)) {
    team = game.activeTeams.get(teamName);
    team.inGame = true;
  } else {
    team = game.inactiveTeams.get(teamName);
    team.inGame = false;
  }
  team.isAuction = game.isAuction;

  socket.emit(teamName + Outgoing.TEAM_STATE, team);
}

function getMoneyPool(socket: UserSocket) {
  const game = socket.room.game;

  socket.emit(Outgoing.MONEY_POOL, { moneyPool: game.moneyPool });
}

function changeTeamStatus(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (
    !game.exists(teamName) ||
    typeof gameData.desiredState !== 'boolean' ||
    gameData.desiredState == null ||
    game.isAuction ||
    game.isAnsweringStage() ||
    game.isInGame(teamName) === gameData.desiredState
  ) {
    return socket.emit(Outgoing.WARNING, 'Zmiana statusu drużyny jest w tym momencie niedozwolona.');
  }

  game.changeTeamStatus(teamName, gameData.desiredState);
  io.in(socket.room.name).emit(teamName + Outgoing.TEAM_STATUS_CHANGED, { state: gameData.desiredState });
}

function changeAuctionAmount(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (
    !game.isAuction ||
    !Number.isInteger(gameData.newAmount) ||
    !game.isInGame(teamName) ||
    !game.bidAmount(teamName, gameData.newAmount)
  ) {
    socket.emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: game.auctionAmount(teamName) });
    return socket.emit(Outgoing.WARNING, `Licytacja kwoty ${gameData.newAmount} jest w tym momencie niedozwolona.`);
  }

  const team = game.activeTeams.get(teamName);
  io.in(socket.room.name).emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
}

function changeAccountBalance(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!Number.isInteger(gameData.newBalance) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: game.accountBalance(teamName) });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana stanu konta na ${gameData.newBalance} jest w tym momencie niedozwolona.`
    );
  }

  game.activeTeams.get(teamName).accountBalance = gameData.newBalance;
  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: gameData.newBalance });
}

function changeHintsCount(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!Number.isInteger(gameData.newCount) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { hintsCount: game.hintsCount(teamName) });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana ilości podpowiedzi na ${gameData.newCount} jest w tym momencie niedozwolona.`
    );
  }

  game.activeTeams.get(teamName).hintsCount = gameData.newCount;
  io.in(socket.room.name).emit(teamName + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: gameData.newCount });
}

function changeBlackBox(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.isInGame(teamName) || typeof gameData.desiredState !== 'boolean' || gameData.desiredState == null) {
    return socket.emit(Outgoing.WARNING, 'Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
  }

  game.changeBlackBox(teamName, gameData.desiredState);
  io.in(socket.room.name).emit(teamName + Outgoing.BLACK_BOX_CHANGED, { state: gameData.desiredState });
}

function changeMoneyPool(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (!Number.isInteger(gameData.newMoneyPool)) {
    socket.emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    return socket.emit(Outgoing.WARNING, `Zmiana puli licytacji na ${gameData.newMoneyPool} nie jest dozwolona.`);
  }

  game.moneyPool = gameData.newMoneyPool;
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
}

function resetAccountBalances(gameData: GameShared, socket: UserSocket) {
  const game = socket.room.game;

  if (!Number.isInteger(gameData.newBalance)) {
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana wszystkich stanów kont na ${gameData.newMoneyPool} nie jest dozwolona.`
    );
  }

  game.activeTeams.forEach(team => {
    team.accountBalance = gameData.newBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
  game.inactiveTeams.forEach(team => {
    team.accountBalance = gameData.newBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
}

function startAuction(socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (game.isAuction === true) {
    return socket.emit(Outgoing.WARNING, 'Aukcja już trwa.');
  }

  game.startAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_STARTED);
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  game.activeTeams.forEach(team => {
    io.in(socket.room.name).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
    io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
}

function finishAuction(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;

  if (game.isAuction === false || !gameData.finishAuctionAction || !game.auctionWinningTeam) {
    return socket.emit(Outgoing.WARNING, 'Nie można zakończyć aukcji.');
  }

  const team = game.finishAuction();

  io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED);
  switch (gameData.finishAuctionAction) {
    case 'grantBlackBox':
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      return io.in(socket.room.name).emit(team.name + Outgoing.BLACK_BOX_CHANGED, { state: team.grantBlackBox() });
    case 'grantHint':
      game.noAnswerNeeded();
      io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
      io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
      return io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.grantHint() });
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
