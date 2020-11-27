import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { QuestionService } from '../../services/question.service';
import { ClashSocket } from '../../utils/socket.util';
import { EventListener } from './event.listener';

export { QuestionListener };

class QuestionListener extends EventListener {
  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_CURRENT_QUESTION, () => QuestionService.getCurrentQuestion(socket));
    socket.on(Incoming.GET_AVAILABLE_CATEGORIES, () => QuestionService.getAvailableCategories(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.ADD_QUESTION_SET, questionData => QuestionService.addQuestionSet(questionData, socket));
    socket.on(Incoming.CHANGE_QUESTION_SET, questionData => QuestionService.changeQuestionSet(questionData, socket));
    socket.on(Incoming.GET_ALL_QUESTION_SETS, () => QuestionService.getAllQuestionSets(socket));
    socket.on(Incoming.SKIP_QUESTION, () => QuestionService.skipQuestion(socket, io));
  }
}
