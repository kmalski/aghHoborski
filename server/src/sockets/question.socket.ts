import { Server } from 'socket.io';
import { Incoming } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import {
  addQuestionSet,
  getAllQuestionSets,
  changeQuestionSet,
  getCurrentQuestion,
  getAvailableCategories
} from '../services/question.service';

export { listen };

function listen(io: Server, socket: UserSocket) {
  socket.on(Incoming.ADD_QUESTION_SET, questionData => addQuestionSet(questionData, socket));
  socket.on(Incoming.CHANGE_QUESTION_SET, questionData => changeQuestionSet(questionData, socket));
  socket.on(Incoming.GET_ALL_QUESTION_SETS, () => getAllQuestionSets(socket));
  socket.on(Incoming.GET_CURRENT_QUESTION, () => getCurrentQuestion(socket));
  socket.on(Incoming.GET_AVAILABLE_CATEGORIES, () => getAvailableCategories(socket));
}
