import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { TeamName } from '../models/team';
import { ClashSocket } from '../utils/socket.util';

export { TeamData, TeamService };

interface TeamData {
  teamName: string;
  newIsInGame?: boolean;
  newAuctionAmount?: number;
  newAccountBalance?: number;
  newHintsCount?: number;
  newHasBlackBox?: boolean;
}

class TeamService {
  getTeamState(data: TeamData, socket: ClashSocket): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (!game.exists(teamName)) {
      return socket.emit(teamName + Outgoing.TEAM_STATE);
    }

    const team = game.getTeam(teamName);
    const teamState = team as any;
    teamState.hasLost = !team.ableToPlay();
    teamState.isInGame = game.isInGame(teamName);
    teamState.isAuction = game.isAuction();

    socket.emit(teamName + Outgoing.TEAM_STATE, teamState);
  }

  changeTeamStatus(data: TeamData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (
      game.isAuction() ||
      game.isAnswering() ||
      !game.exists(teamName) ||
      typeof data.newIsInGame !== 'boolean' ||
      game.isInGame(teamName) === data.newIsInGame
    ) {
      return socket.emit(Outgoing.WARNING, 'Zmiana statusu drużyny jest w tym momencie niedozwolona.');
    }

    game.changeTeamStatus(teamName, data.newIsInGame);

    io.in(socket.room.name).emit(teamName + Outgoing.TEAM_STATUS_CHANGED, { isInGame: data.newIsInGame });
  }

  changeAuctionAmount(data: TeamData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (
      !Number.isInteger(data.newAuctionAmount) ||
      !game.isAuction() ||
      !game.isInGame(teamName) ||
      !game.bidAmount(teamName, data.newAuctionAmount)
    ) {
      socket.emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: game.getTeam(teamName).auctionAmount });
      return socket.emit(
        Outgoing.WARNING,
        `Licytacja kwoty ${data.newAuctionAmount} jest w tym momencie niedozwolona.`
      );
    }

    const team = game.activeTeams.get(teamName);
    io.in(socket.room.name).emit(teamName + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
    io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
  }

  changeAccountBalance(data: TeamData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (!Number.isInteger(data.newAccountBalance) || !game.isInGame(teamName)) {
      socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
        accountBalance: game.getTeam(teamName).accountBalance
      });
      return socket.emit(
        Outgoing.WARNING,
        `Zmiana stanu konta na ${data.newAccountBalance} jest w tym momencie niedozwolona.`
      );
    }

    const team = game.getActiveTeam(teamName);
    team.accountBalance = data.newAccountBalance;

    io.in(socket.room.name).emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, {
      accountBalance: team.accountBalance,
      hasLost: !team.ableToPlay()
    });
  }

  changeHintsCount(data: TeamData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (!Number.isInteger(data.newHintsCount) || !game.isInGame(teamName)) {
      socket.emit(teamName + Outgoing.ACCOUNT_BALANCE_CHANGED, { hintsCount: game.getTeam(teamName).hintsCount });
      return socket.emit(
        Outgoing.WARNING,
        `Zmiana ilości podpowiedzi na ${data.newHintsCount} jest w tym momencie niedozwolona.`
      );
    }

    game.getActiveTeam(teamName).hintsCount = data.newHintsCount;
    io.in(socket.room.name).emit(teamName + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: data.newHintsCount });
  }

  changeBlackBox(data: TeamData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const teamName = data.teamName as TeamName;

    if (!game.isInGame(teamName) || typeof data.newHasBlackBox !== 'boolean') {
      return socket.emit(Outgoing.WARNING, 'Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
    }

    game.getActiveTeam(teamName).hasBlackBox = data.newHasBlackBox;
    io.in(socket.room.name).emit(teamName + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: data.newHasBlackBox });
  }

  resetAccountBalances(data: TeamData, socket: ClashSocket): void | boolean {
    const game = socket.room.game;

    if (!Number.isInteger(data.newAccountBalance)) {
      return socket.emit(
        Outgoing.WARNING,
        `Zmiana wszystkich stanów kont na ${data.newAccountBalance} nie jest dozwolona.`
      );
    }

    game.activeTeams.forEach(team => {
      team.accountBalance = data.newAccountBalance;
      socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    });
    game.inactiveTeams.forEach(team => {
      team.accountBalance = data.newAccountBalance;
      socket.emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    });
  }
}
