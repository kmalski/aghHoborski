import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { ClashSocket } from '../utils/socket.util';
import { emitAccountChanges } from '../utils/service.util';
import { TeamName } from '../models/team';

export { OneOnOneService, OneOnOneData };

interface OneOnOneData {
  category?: string;
  enabled?: boolean;
  teamName?: string;
}

class OneOnOneService {
  getOneOnOneState(socket: ClashSocket): void | boolean {
    const game = socket.room.game;
    const questions = socket.room.questions;

    if (!game.isOneOnOne()) {
      return socket.emit(Outgoing.ONE_ON_ONE_STATE, { roundStage: game.roundStage });
    }

    const teams = game.oneOnOne.teams.map(team => team.name);
    const category = questions?.current?.category;

    socket.emit(Outgoing.ONE_ON_ONE_STATE, {
      roundStage: game.roundStage,
      categories: game.oneOnOne.categories,
      category: category,
      teams: teams,
      team: game.auctionWinningTeam
    });
  }

  startOneOnOne(socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const questions = socket.room.questions;

    if (game.stageNumber !== 2 || !game.isIdle() || game.getAbleToPlaySize() !== 2) {
      return socket.emit(Outgoing.WARNING, 'Nie można rozpocząć rundy jeden na jeden.');
    }

    const categories = questions.drawCategories();
    game.startOneOnOne(categories);

    io.in(socket.room.name).emit(Outgoing.ONE_ON_ONE_STARTED, {
      categories: game.oneOnOne.categories,
      teams: game.oneOnOne.teams.map(team => team.name)
    });
    emitAccountChanges(game, socket.room.name, io);
  }

  changeCategoryState(data: OneOnOneData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;

    if (!data?.category || data.enabled == null) {
      return socket.emit(Outgoing.WARNING, 'Nieznana kategoria.');
    }

    const category = game.oneOnOne.setCategoryState(data.category, data.enabled);

    io.in(socket.room.name).emit(Outgoing.CATEGORY_STATE_CHANGED, {
      category: category.name,
      enabled: category.enabled
    });
  }

  confirmCategory(socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;
    const questions = socket.room.questions;

    if (!game.isOneOnOne() || game.oneOnOne.getEnabledCategories().length !== 1) {
      return socket.emit(Outgoing.WARNING, 'W jeden na jeden musi pozostać tylko jedna kategoria.');
    }

    const category = game.oneOnOne.getCategory();
    questions.setCategory(category.name);
    const question = questions.drawQuestion();
    game.finishAuction();

    io.in(socket.room.name).emit(Outgoing.CATEGORY_CONFIRMED, { category: category.name });
    io.in(socket.room.name).emit(Outgoing.NEXT_QUESTION, {
      category: questions.current.category,
      question: question.content,
      hints: question.hints
    });
  }

  chooseTeam(data: OneOnOneData, socket: ClashSocket, io: Server): void | boolean {
    const game = socket.room.game;

    if (!game.isOneOnOne() && !game.isAnswering() || !game.isInGame(data?.teamName as TeamName)) {
      return socket.emit(Outgoing.WARNING, 'Nie można zmienić zespołu odpowiadającego w jeden na jeden.');
    }

    const team = game.getTeam(data.teamName as TeamName);
    game.auctionWinningTeam = team;
    game.oneOnOne = null;

    io.in(socket.room.name).emit(Outgoing.TEAM_CHOSEN, { team: team.name });
  }
}
