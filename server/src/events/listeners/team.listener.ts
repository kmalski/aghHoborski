import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { TeamService } from '../../services/team.service';
import { ClashSocket } from '../../utils/socket.util';
import { EventListener } from './event.listener';

export { TeamListener };

class TeamListener extends EventListener {
  private static SERVICE: TeamService = new TeamService();

  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_TEAM_STATE, teamData => this.SERVICE.getTeamState(teamData, socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.CHANGE_TEAM_STATUS, teamData => this.SERVICE.changeTeamStatus(teamData, socket, io));
    socket.on(Incoming.CHANGE_AUCTION_AMOUNT, teamData => this.SERVICE.changeAuctionAmount(teamData, socket, io));
    socket.on(Incoming.CHANGE_ACCOUNT_BALANCE, teamData => this.SERVICE.changeAccountBalance(teamData, socket, io));
    socket.on(Incoming.CHANGE_HINTS_COUNT, teamData => this.SERVICE.changeHintsCount(teamData, socket, io));
    socket.on(Incoming.CHANGE_BLACK_BOX, teamData => this.SERVICE.changeBlackBox(teamData, socket, io));
    socket.on(Incoming.RESET_ACCOUNT_BALANCES, teamData => this.SERVICE.resetAccountBalances(teamData, socket));
  }
}
