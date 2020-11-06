import { Server } from 'socket.io';
import { UserSocket } from '../utils/socket.utils';
import { Incoming } from '../utils/event.constants';
import { grantBlackBox, removeBlackBox } from '../services/game.service';

export { listen };

function listen(socket: UserSocket) {
  socket.on(Incoming.GRANT_BLACK_BOX, (gameData, acknowledge) => {
    const result = grantBlackBox(gameData, socket);
    acknowledge(result);
  });

  socket.on(Incoming.REMOVE_BLACK_BOX, (gameData, acknowledge) => {
    const result = removeBlackBox(gameData, socket);
    acknowledge(result);
  });
}
