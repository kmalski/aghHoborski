import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { QuestionService, LocalQuestionService } from '../../services/question.service';
import { ClashSocket } from '../../utils/socket.util';
import { EventListener, Options } from './event.listener';

export { QuestionListener };

class QuestionListener extends EventListener {
  private static SERVICE: QuestionService;
  private static USE_DATABASE: boolean;

  static configure(options: Options): void {
    if (this.USE_DATABASE == options.useDatabase) return;

    if (options.useDatabase) {
      this.SERVICE = new QuestionService();
    } else {
      this.SERVICE = new LocalQuestionService();
    }
  }

  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_CURRENT_QUESTION, () => this.SERVICE.getCurrentQuestion(socket));
    socket.on(Incoming.GET_AVAILABLE_CATEGORIES, () => this.SERVICE.getAvailableCategories(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.ADD_QUESTION_SET, questionData => this.SERVICE.addQuestionSet(questionData, socket));
    socket.on(Incoming.CHANGE_QUESTION_SET, questionData => this.SERVICE.changeQuestionSet(questionData, socket));
    socket.on(Incoming.GET_ALL_QUESTION_SETS, () => this.SERVICE.getAllQuestionSets(socket));
    socket.on(Incoming.SKIP_QUESTION, () => this.SERVICE.skipQuestion(socket, io));
  }
}
