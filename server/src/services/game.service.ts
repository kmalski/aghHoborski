import { Server } from 'socket.io';
import { Game, GameShared } from '../models/game.model';
import { UserSocket } from '../utils/socket.utils';
import { TeamName, TeamShared } from '../models/team.model';
import { Outgoing } from '../utils/event.constants';

export { changeBlackBox, changeTeamStatus, getTeamState };

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
  socket.emit(teamName + Outgoing.TEAM_STATE, team);
}

function changeBlackBox(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.isInGame(teamName) || gameData.desiredState == null) return;

  game.changeBlackBox(teamName, gameData.desiredState);
  io.in(socket.room.name).emit(teamName + Outgoing.BLACK_BOX_CHANGED, { state: gameData.desiredState });
}

function changeTeamStatus(gameData: GameShared, socket: UserSocket, io: Server) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (gameData.desiredState == null) return;
  if (game.isInGame(teamName) === gameData.desiredState) return;

  game.changeTeamStatus(teamName, gameData.desiredState);
  io.in(socket.room.name).emit(teamName + Outgoing.TEAM_STATUS_CHANGED, { state: gameData.desiredState });
}
