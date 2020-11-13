import { Server } from 'socket.io';
import { Outgoing } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { RoomModel } from '../models/room.model';
import { QuestionSetModel, QuestionSet, QuestionSetData } from '../models/question.model';

export {
  addQuestionSet,
  getAllQuestionSets,
  changeQuestionSet,
  getCurrentQuestion,
  getAvailableCategories,
  drawNextQuestion
};

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

  if (!questions || !game.isAnsweringStage()) {
    return socket.emit(Outgoing.CURRENT_QUESTION, {});
  }

  if (!questions.current) {
    return socket.emit(Outgoing.WARNING, 'Nie wybrano kategorii');
  }

  const question = questions.current.question;
  socket.emit(Outgoing.CURRENT_QUESTION, {
    category: questions.current.category,
    question: question.content,
    hints: question.hints
  });
}

function drawNextQuestion(questionData: QuestionSetData, socket: UserSocket, io: Server) {
  const questions = socket.room.questions;

  if (!questions) {
    return socket.emit(Outgoing.WARNING, 'Nie wybrano zestawu pytań');
  } else if (!questionData || !questionData.categoryName || !questions.categoryExists(questionData.categoryName)) {
    return socket.emit(Outgoing.WARNING, 'Podana kategoria nie istnieje.');
  }

  const question = questions.getNextQuestion(questionData.categoryName);
  socket.emit(Outgoing.SUCCESS);
  io.in(socket.room.name).emit(Outgoing.NEXT_QUESTION, {
    category: questionData.categoryName,
    question: question.content,
    hints: question.hints
  });
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
