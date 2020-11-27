import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { RoomModel } from '../models/schemas/room.schema';
import { RoundStage } from '../models/game';
import { QuestionSet } from '../models/question';
import { QuestionSetModel } from '../models/schemas/question.schema';
import { ClashSocket } from '../utils/socket.util';

export { QuestionService, QuestionData };

interface QuestionData {
  categoryName?: string;
  name?: string;
  file?: any;
}

class QuestionService {
  static async getAllQuestionSets(socket: ClashSocket) {
    const questionSetDb = await QuestionSetModel.find().select('name createdAt -_id');

    socket.emit(Outgoing.ALL_QUESTION_SETS, questionSetDb);
  }

  static getCurrentQuestion(socket: ClashSocket) {
    const game = socket.room.game;
    const questions = socket.room.questions;

    const currentQuestion = {
      roundStage: game.roundStage,
      roundNumber: game.roundNumber,
      stageNumber: game.stageNumber
    } as any;
    switch (game.roundStage) {
      case RoundStage.IDLE:
        break;
      case RoundStage.AUCTION:
        currentQuestion.category = questions.current.category;
        break;
      case RoundStage.ANSWERING:
        currentQuestion.content = questions.current.question.content;
        currentQuestion.hints = questions.current.question.hints;
        currentQuestion.winningTeam = game.auctionWinningTeam.name;
        currentQuestion.hintUsed = questions.current.hintUsed;
        break;
    }

    return socket.emit(Outgoing.CURRENT_QUESTION, currentQuestion);
  }

  static getAvailableCategories(socket: ClashSocket) {
    const questions = socket.room.questions;

    if (!questions) {
      return socket.emit(Outgoing.WARNING, 'Nie wybrano zestawu pytań');
    }

    const categories = [];
    questions.categories.forEach((categoryQuestions, category) => {
      if (categoryQuestions.some(question => !question.used)) {
        categories.push(category);
      }
    });
    categories.sort();

    return socket.emit(Outgoing.AVAILABLE_CATEGORIES, { categories });
  }

  static async addQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questionSet = await QuestionSetModel.findOne({ name: data.name });

    if (questionSet) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} już istnieje.`);
    }

    const fileData = JSON.parse(data.file);
    const questionSetDb = await QuestionSetModel.create({ name: data.name, categories: fileData.categories });
    await questionSetDb.save();

    await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

    socket.room.questions = new QuestionSet(data.name, fileData.categories);
    socket.emit(Outgoing.SUCCESS);
  }

  static async changeQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questionSetDb = await QuestionSetModel.findOne({ name: data.name });

    if (!questionSetDb) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} nie istnieje.`);
    }
    await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

    socket.room.questions = new QuestionSet(questionSetDb.name, questionSetDb.categories);
    socket.emit(Outgoing.SUCCESS);
  }

  static skipQuestion(socket: ClashSocket, io: Server) {
    const questions = socket.room.questions;
    const game = socket.room.game;

    if (game.roundStage !== RoundStage.ANSWERING) {
      return socket.emit(Outgoing.WARNING, 'Operacja możliwa do wykonania jedynie w fazie pytań.');
    }

    const question = questions.drawQuestion();
    if (!question) {
      return socket.emit(Outgoing.WARNING, 'Brak nowych pytań z wybranej kategorii.');
    }

    io.in(socket.room.name).emit(Outgoing.NEXT_QUESTION, {
      category: questions.current.category,
      question: question.content,
      hints: question.hints
    });
  }
}
