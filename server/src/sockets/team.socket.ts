import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../constans/event.constants';
import {
  changeTeamStatus,
  getTeamState,
  changeBlackBox,
  changeAuctionAmount,
  changeAccountBalance,
  changeHintsCount,
  resetAccountBalances
} from '../services/team.service';

export { listen, listenAdmin };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_TEAM_STATE, teamData => getTeamState(teamData, socket));
}

function listenAdmin(io: Server, socket: UserSocket) {
  socket.on(Incoming.CHANGE_TEAM_STATUS, teamData => changeTeamStatus(teamData, socket, io));
  socket.on(Incoming.CHANGE_AUCTION_AMOUNT, teamData => changeAuctionAmount(teamData, socket, io));
  socket.on(Incoming.CHANGE_ACCOUNT_BALANCE, teamData => changeAccountBalance(teamData, socket, io));
  socket.on(Incoming.CHANGE_HINTS_COUNT, teamData => changeHintsCount(teamData, socket, io));
  socket.on(Incoming.CHANGE_BLACK_BOX, teamData => changeBlackBox(teamData, socket, io));
  socket.on(Incoming.RESET_ACCOUNT_BALANCES, teamData => resetAccountBalances(teamData, socket));
}
