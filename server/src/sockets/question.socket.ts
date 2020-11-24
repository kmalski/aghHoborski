import { Server } from 'socket.io';
import { Incoming } from '../constans/event.constants';
import { UserSocket } from '../utils/socket.utils';
import {
  addQuestionSet,
  getAllQuestionSets,
  changeQuestionSet,
  getCurrentQuestion,
  getAvailableCategories,
  skipQuestion,
  useHint
} from '../services/question.service';

export { listen, listenAdmin };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.GET_CURRENT_QUESTION, () => getCurrentQuestion(socket));
  socket.on(Incoming.GET_AVAILABLE_CATEGORIES, () => getAvailableCategories(socket));
}

function listenAdmin(io: Server, socket: UserSocket) {
  socket.on(Incoming.ADD_QUESTION_SET, questionData => addQuestionSet(questionData, socket));
  socket.on(Incoming.CHANGE_QUESTION_SET, questionData => changeQuestionSet(questionData, socket));
  socket.on(Incoming.GET_ALL_QUESTION_SETS, () => getAllQuestionSets(socket));
  socket.on(Incoming.SKIP_QUESTION, () => skipQuestion(socket, io));
  socket.on(Incoming.USE_HINT, () => useHint(socket, io));
}
