import { Server } from 'socket.io';
import { Game } from '../models/game';
import { Outgoing } from '../events/event.constants';
import { QuestionSet } from '../models/question';
import { ClashSocket } from '../utils/socket.util';

export { AuctionData, AuctionService };

interface AuctionData {
  categoryName?: string;
  newAuctionAmount?: number;
}

class AuctionService {
  static startAuction(data: AuctionData, socket: ClashSocket, io: Server) {
    const game = socket.room.game;
    const questions = socket.room.questions;

    if (!game.isIdle() || game.getAbleToPlaySize() < 2 || !data.categoryName) {
      return socket.emit(Outgoing.FAIL, 'Nie można rozpocząć licytacji.');
    }

    if (!questions || !questions.categoryExists(data.categoryName)) {
      return socket.emit(Outgoing.FAIL, 'Podana kategoria nie istnieje.');
    }

    questions.setCategory(data.categoryName);
    game.startAuction();

    socket.emit(Outgoing.SUCCESS);
    io.in(socket.room.name).emit(Outgoing.AUCTION_STARTED, {
      category: questions.current.category,
      roundNumber: game.roundNumber
    });
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    game.activeTeams.forEach(team => {
      if (team.ableToPlay()) {
        io.in(socket.room.name).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, {
          auctionAmount: team.auctionAmount
        });
        io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, {
          accountBalance: team.accountBalance
        });
      }
    });
  }

  static finishAuction(socket: ClashSocket, io: Server) {
    const game = socket.room.game;
    const questions = socket.room.questions;

    if (!game.isAuction() || !game.auctionWinningTeam) {
      return socket.emit(Outgoing.WARNING, 'Nie można zakończyć licytacji.');
    }

    const team = game.finishAuction();

    io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED, { winningTeam: team.name });
    if (!team.ableToPlay()) {
      io.in(socket.room.name).emit(team.name + Outgoing.HAS_LOST_CHANGED, { hasLost: true });
    }

    switch (questions.current.category) {
      case QuestionSet.BLACK_BOX_CATEGORY:
        game.noAnswerNeeded();
        io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
        io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
        io.in(socket.room.name).emit(team.name + Outgoing.BLACK_BOX_CHANGED, { hasBlackBox: team.grantBlackBox() });
        this.emitAuctionAmountChanged(game, socket.room.name, io);
        break;
      case QuestionSet.HINT_CATEGORY:
        game.noAnswerNeeded();
        io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
        io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
        io.in(socket.room.name).emit(team.name + Outgoing.HINTS_COUNT_CHANGED, { hintsCount: team.grantHint() });
        this.emitAuctionAmountChanged(game, socket.room.name, io);
        break;
      default:
        const question = questions.drawQuestion();
        io.in(socket.room.name).emit(Outgoing.NEXT_QUESTION, {
          category: questions.current.category,
          question: question.content,
          hints: question.hints
        });
        break;
    }
  }

  static cancelAuction(socket: ClashSocket, io: Server) {
    const game = socket.room.game;

    if (!game.isAuction()) {
      return socket.emit(Outgoing.WARNING, 'Nie można anulować licytacji.');
    }

    socket.room.questions.current.category = null;
    game.cancelAuction();

    io.in(socket.room.name).emit(Outgoing.AUCTION_FINISHED, { winningTeam: null });
    io.in(socket.room.name).emit(Outgoing.ROUND_FINISHED);
    io.in(socket.room.name).emit(Outgoing.MONEY_POOL_CHANGED, { moneyPool: game.moneyPool });
    game.activeTeams.forEach(team => {
      io.in(socket.room.name).emit(team.name + Outgoing.ACCOUNT_BALANCE_CHANGED, {
        accountBalance: team.accountBalance
      });
      io.in(socket.room.name).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
    });
  }

  private static emitAuctionAmountChanged(game: Game, room: string, io: Server) {
    game.activeTeams.forEach(team => {
      io.in(room).emit(team.name + Outgoing.AUCTION_AMOUNT_CHANGED, { auctionAmount: team.auctionAmount });
    });
  }
}
