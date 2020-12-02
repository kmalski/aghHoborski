import { Server } from 'socket.io';
import { Outgoing } from '../events/event.constants';
import { RoomModel } from '../models/schemas/room.schema';
import { RoundStage } from '../models/game';
import { QuestionSet } from '../models/question';
import { QuestionSetModel } from '../models/schemas/question.schema';
import { ClashSocket } from '../utils/socket.util';

export { QuestionService, LocalQuestionService, QuestionData };

interface QuestionData {
  categoryName?: string;
  name?: string;
  file?: any;
}

class QuestionService {
  async getAllQuestionSets(socket: ClashSocket) {
    const questionSetDb = await QuestionSetModel.find().select('name owner createdAt -_id');

    socket.emit(Outgoing.ALL_QUESTION_SETS, questionSetDb);
  }

  getCurrentQuestion(socket: ClashSocket) {
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

  getAvailableCategories(socket: ClashSocket) {
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

  async getQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questions = socket.room.questions;
    let name: string;

    if (data && data.name) {
      name = data.name;
    } else if (questions) {
      name = questions.name;
    }

    if (name) {
      const questionSet = await QuestionSetModel.findOne({ name }).select('name owner categories -_id');

      socket.emit(Outgoing.QUESTION_SET, {
        name,
        owner: questionSet.owner,
        questionSet: { categories: questionSet.categories }
      });
    } else {
      socket.emit(Outgoing.QUESTION_SET, {});
    }
  }

  async addQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questionSet = await QuestionSetModel.findOne({ name: data.name });

    if (questionSet && questionSet.owner !== socket.room.name) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} już istnieje.`);
    }

    const fileData = JSON.parse(data.file);
    let questionSetDb;

    if (questionSet) {
      questionSet.categories = fileData.categories;
      await questionSet.save();
      questionSetDb = questionSet;
    } else {
      questionSetDb = await QuestionSetModel.create({
        name: data.name,
        owner: socket.room.name,
        categories: fileData.categories
      });
      await questionSetDb.save();
    }

    await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

    socket.room.questions = new QuestionSet(data.name, fileData.categories);
    socket.emit(Outgoing.SUCCESS);
  }

  async changeQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questionSetDb = await QuestionSetModel.findOne({ name: data.name });

    if (!questionSetDb) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} nie istnieje.`);
    }
    await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

    socket.room.questions = new QuestionSet(questionSetDb.name, questionSetDb.categories);
    socket.emit(Outgoing.SUCCESS);
  }

  skipQuestion(socket: ClashSocket, io: Server) {
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

class LocalQuestionService extends QuestionService {
  static QUESTION_SETS: { name: string; owner: string; strData: string; createdAt: Date }[] = [];

  async getAllQuestionSets(socket: ClashSocket) {
    const questionsPruned = [];

    LocalQuestionService.QUESTION_SETS.forEach(question => {
      questionsPruned.push({ name: question.name, owner: question.owner, createdAt: question.createdAt });
    });

    socket.emit(Outgoing.ALL_QUESTION_SETS, questionsPruned);
  }

  async getQuestionSet(data: QuestionData, socket: ClashSocket) {
    const questions = socket.room.questions;
    let name: string;

    if (data && data.name) {
      name = data.name;
    } else if (questions) {
      name = questions.name;
    }

    if (name) {
      const questionSet = LocalQuestionService.QUESTION_SETS.find(q => q.name === name);
      const parsedData = JSON.parse(questionSet.strData);

      socket.emit(Outgoing.QUESTION_SET, { name, owner: questionSet.owner, questionSet: parsedData });
    } else {
      socket.emit(Outgoing.QUESTION_SET, {});
    }
  }

  async addQuestionSet(data: QuestionData, socket: ClashSocket) {
    let questionSet = LocalQuestionService.QUESTION_SETS.find(q => q.name === data.name);

    if (questionSet && questionSet.owner !== socket.room.name) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} już istnieje.`);
    }

    if (questionSet) {
      questionSet.strData = data.file;
    } else {
      LocalQuestionService.QUESTION_SETS.push({
        name: data.name,
        owner: socket.room.name,
        strData: data.file,
        createdAt: new Date()
      });
    }

    const fileData = JSON.parse(data.file);
    socket.room.questions = new QuestionSet(data.name, fileData.categories);

    socket.emit(Outgoing.SUCCESS);
  }

  async changeQuestionSet(data: QuestionData, socket: ClashSocket) {
    let questionSet = LocalQuestionService.QUESTION_SETS.find(q => q.name === data.name);

    if (!questionSet) {
      return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${data.name} nie istnieje.`);
    }

    const parsed = JSON.parse(questionSet.strData);

    socket.room.questions = new QuestionSet(questionSet.name, parsed.categories);
    socket.emit(Outgoing.SUCCESS);
  }
}
