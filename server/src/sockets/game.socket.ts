import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../utils/event.constants';
import { changeBlackBox, changeTeamStatus, getTeamState } from '../services/game.service';

export { listen };

// TODO: not all events should be restrictet to admin
function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_TEAM_STATE, gameData => getTeamState(gameData, socket));
  socket.on(Incoming.CHANGE_BLACK_BOX, gameData => changeBlackBox(gameData, socket, io));
  socket.on(Incoming.CHANGE_TEAM_STATUS, gameData => changeTeamStatus(gameData, socket, io));
}
