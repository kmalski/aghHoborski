import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { ClashSocket } from '../utils/socket.util';

export { HintService, HintData };

interface HintData {
  newHintAmount?: number;
}

class HintService {
  startHintAuction(socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;

    if (!game.isAnswering() || game.isHintAuction()) {
      return socket.emit(Outgoing.WARNING, 'Nie można rozpocząć licytacji o podpowiedź.');
    }

    if (game.auctionWinningTeam.accountBalance <= 0) {
      return socket.emit(Outgoing.WARNING, 'Odpowiadający zespół nie ma już pieniędzy.');
    }

    game.startHintAuction();

    io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_STARTED, { hintAmount: game.hintAmount });
  }

  acceptHintAmount(socket: ClashSocket, io: Server): void {
    const game = socket.room.game;
    const team = game.auctionWinningTeam;

    game.acceptHintAuction();

    io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_FINISHED);
    io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.hintsCount });
    io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, { accountBalance: team.accountBalance });
    io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
  }

  discardHintAmount(socket: ClashSocket, io: Server): void {
    const game = socket.room.game;

    game.discardHintAuction();

    io.in(socket.room.name).emit(Outgoing.HINT_AUCTION_FINISHED);
    io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
  }

  changeHintAmount(data: HintData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;

    if (!Number.isInteger(data.newHintAmount)) {
      socket.emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
      return socket.emit(
        Outgoing.WARNING,
        `Zmiana kwoty licytacji podpowiedzi na ${data.newHintAmount} nie jest dozwolona.`
      );
    }

    game.hintAmount = data.newHintAmount;
    io.in(socket.room.name).emit(Outgoing.HINT_AMOUNT_CHANGED, { hintAmount: game.hintAmount });
  }

  useHint(socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;

    if (!game.isAnswering() || socket.room.questions.current.hintUsed) {
      return socket.emit(Outgoing.WARNING, 'Nie można teraz zużyć podpowiedzi.');
    }

    if (game.auctionWinningTeam.hintsCount < 1) {
      return socket.emit(Outgoing.WARNING, 'Odpowiadający zespół nie ma podpowiedzi do wykorzystania.');
    }

    const team = game.auctionWinningTeam;
    const hints = socket.room.questions.current.question.hints;
    socket.room.questions.current.hintUsed = true;
    team.hintsCount -= 1;

    io.in(socket.room.name).emit(Outgoing.HINT_USED, { hints });
    io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.hintsCount });
    // io.in(socket.room.name).emit(Outgoing.TIME_STARTED, { value: 60 });
  }
}
