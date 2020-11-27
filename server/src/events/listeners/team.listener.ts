import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { TeamService } from '../../services/team.service';
import { ClashSocket } from '../../utils/socket.util';
import { EventListener } from './event.listener';

export { TeamListener };

class TeamListener extends EventListener {
  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_TEAM_STATE, teamData => TeamService.getTeamState(teamData, socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.CHANGE_TEAM_STATUS, teamData => TeamService.changeTeamStatus(teamData, socket, io));
    socket.on(Incoming.CHANGE_AUCTION_AMOUNT, teamData => TeamService.changeAuctionAmount(teamData, socket, io));
    socket.on(Incoming.CHANGE_ACCOUNT_BALANCE, teamData => TeamService.changeAccountBalance(teamData, socket, io));
    socket.on(Incoming.CHANGE_HINTS_COUNT, teamData => TeamService.changeHintsCount(teamData, socket, io));
    socket.on(Incoming.CHANGE_BLACK_BOX, teamData => TeamService.changeBlackBox(teamData, socket, io));
    socket.on(Incoming.RESET_ACCOUNT_BALANCES, teamData => TeamService.resetAccountBalances(teamData, socket));
  }
}
