import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Outgoing } from '../constans/event.constants';
import { TeamData, TeamName, TeamShared } from '../models/team.model';

export {
  getTeamState,
  changeTeamStatus,
  changeBlackBox,
  changeAuctionAmount,
  changeAccountBalance,
  changeHintsCount,
  resetAccountBalances
};

function getTeamState(teamData: TeamData, socket: UserSocket) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (!game.exists(teamName)) {
    return socket.emit(teamName + Outgoing.TEAM_STATE);
  }

  const team = game.getTeam(teamName);
  const teamShared = team as TeamShared;
  teamShared.hasLost = !team.ableToPlay();
  teamShared.isInGame = game.isInGame(teamName);
  teamShared.isAuction = game.isAuction();

  socket.emit(teamName + Outgoing.TEAM_STATE, teamShared);
}

function changeTeamStatus(teamData: TeamData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (
    game.isAuction() ||
    game.isAnswering() ||
    !game.exists(teamName) ||
    typeof teamData.newIsInGame !== 'boolean' ||
    game.isInGame(teamName) === teamData.newIsInGame
  ) {
    return socket.emit(Outgoing.WARNING, 'Zmiana statusu drużyny jest w tym momencie niedozwolona.');
  }

  game.changeTeamStatus(teamName, teamData.newIsInGame);

  io.in(socket.room.name).emit(teamName + Outgoing.TEAM_STATUS_CHANGED, { isInGame: teamData.newIsInGame });
}

function changeAuctionAmount(teamData: TeamData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (
    !Number.isInteger(teamData.newAuctionAmount) ||
    !game.isAuction() ||
    !game.isInGame(teamName) ||
    !game.bidAmount(teamName, teamData.newAuctionAmount)
  ) {
    socket.emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: game.getTeam(teamName).auctionAmount });
    return socket.emit(
      Outgoing.WARNING,
      `Licytacja kwoty ${teamData.newAuctionAmount} jest w tym momencie niedozwolona.`
    );
  }

  const team = game.activeTeams.get(teamName);
  io.in(socket.room.name).emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
}

function changeAccountBalance(teamData: TeamData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (!Number.isInteger(teamData.newAccountBalance) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
      accountBalance: game.getTeam(teamName).accountBalance
    });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana stanu konta na ${teamData.newAccountBalance} jest w tym momencie niedozwolona.`
    );
  }

  const team = game.getActiveTeam(teamName);
  team.accountBalance = teamData.newAccountBalance;

  io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
    accountBalance: team.accountBalance,
    hasLost: !team.ableToPlay()
  });
}

function changeHintsCount(teamData: TeamData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (!Number.isInteger(teamData.newHintsCount) || !game.isInGame(teamName)) {
    socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { hintsCount: game.getTeam(teamName).hintsCount });
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana ilości podpowiedzi na ${teamData.newHintsCount} jest w tym momencie niedozwolona.`
    );
  }

  game.getActiveTeam(teamName).hintsCount = teamData.newHintsCount;
  io.in(socket.room.name).emit(teamName + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: teamData.newHintsCount });
}

function changeBlackBox(teamData: TeamData, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = teamData.teamName as TeamName;

  if (!game.isInGame(teamName) || typeof teamData.newHasBlackBox !== 'boolean') {
    return socket.emit(Outgoing.WARNING, 'Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
  }

  game.getActiveTeam(teamName).hasBlackBox = teamData.newHasBlackBox;
  io.in(socket.room.name).emit(teamName + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: teamData.newHasBlackBox });
}

function resetAccountBalances(teamData: TeamData, socket: UserSocket) {
  const game = socket.room.game;

  if (!Number.isInteger(teamData.newAccountBalance)) {
    return socket.emit(
      Outgoing.WARNING,
      `Zmiana wszystkich stanów kont na ${teamData.newAccountBalance} nie jest dozwolona.`
    );
  }

  game.activeTeams.forEach(team => {
    team.accountBalance = teamData.newAccountBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
  game.inactiveTeams.forEach(team => {
    team.accountBalance = teamData.newAccountBalance;
    socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
  });
}
