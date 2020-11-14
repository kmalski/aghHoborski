import { Server } from 'socket.io';
import { Outgoing } from '../constans/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { RoomModel } from '../models/room.model';
import { QuestionSetModel, QuestionSet, QuestionSetData } from '../models/question.model';

export { addQuestionSet, getAllQuestionSets, changeQuestionSet, getCurrentQuestion, getAvailableCategories };

async function addQuestionSet(questionData: QuestionSetData, socket: UserSocket) {
  const questionSet = await QuestionSetModel.findOne({ name: questionData.name });

  if (questionSet) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionData.name} już istnieje.`);
  }

  const data = JSON.parse(questionData.file);
  const questionSetDb = await QuestionSetModel.create({ name: questionData.name, categories: data.categories });
  await questionSetDb.save();

  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

  socket.room.questions = new QuestionSet(questionData.name, data.categories);
  socket.emit(Outgoing.SUCCESS);
}

async function changeQuestionSet(questionData: QuestionSetData, socket: UserSocket) {
  const questionSetDb = await QuestionSetModel.findOne({ name: questionData.name });

  if (!questionSetDb) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionData.name} nie istnieje.`);
  }
  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

  socket.room.questions = new QuestionSet(questionSetDb.name, questionSetDb.categories);
  socket.emit(Outgoing.SUCCESS);
}

async function getAllQuestionSets(socket: UserSocket) {
  const questionSetDb = await QuestionSetModel.find().select('name createdAt -_id');

  socket.emit(Outgoing.ALL_QUESTION_SETS, questionSetDb);
}

function getCurrentQuestion(socket: UserSocket) {
  const game = socket.room.game;
  const questions = socket.room.questions;

  if (!questions || !questions.current) {
    return socket.emit(Outgoing.CURRENT_QUESTION, { roundStage: game.roundStage, roundNumber: game.roundNumber });
  }

  const current = questions.current;
  const question = { category: current.category, roundStage: game.roundStage, roundNumber: game.roundNumber } as any;
  if (current.question) {
    question.content = current.question.content;
    question.hints = current.question.hints;
    question.winningTeam = game.auctionWinningTeam.name;
  }
  socket.emit(Outgoing.CURRENT_QUESTION, question);
}

function getAvailableCategories(socket: UserSocket) {
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
