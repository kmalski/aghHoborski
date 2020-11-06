import { Game, GameShared } from '../models/game.model';
import { UserSocket } from '../utils/socket.utils';
import { TeamName } from '../models/team.model';
import { Outgoing } from '../utils/event.constants';

export { grantBlackBox, removeBlackBox };

function grantBlackBox(gameData: GameShared, socket: UserSocket) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.isIn(teamName)) return false;

  game.grantBlackBox(teamName);
  socket.to(socket.room.name).emit(Outgoing.BLACK_BOX_GRANTED, { teamName: teamName });
  return true;
}

function removeBlackBox(gameData: GameShared, socket: UserSocket) {
  const game = socket.room.game;
  const teamName = gameData.teamName as TeamName;

  if (!game.isIn(teamName)) return false;

  game.removeBlackBox(teamName);
  socket.to(socket.room.name).emit(Outgoing.BLACK_BOX_REMOVED, { teamName: teamName });
  return true;
}
