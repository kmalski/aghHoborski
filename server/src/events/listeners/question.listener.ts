import { Server } from 'socket.io';
import { Incoming } from '../event.constants';
import { QuestionService, LocalQuestionService } from '../../services/question.service';
import { ClashSocket } from '../../utils/socket.util';
import { EventListener, Options } from './event.listener';
import { Logger } from "../../utils/logger";

export { QuestionListener };

class QuestionListener extends EventListener {
  private static SERVICE: QuestionService;
  private static USE_DATABASE: boolean;

  static configure(options: Options): void {
    if (this.USE_DATABASE == options.useDatabase) return;

    if (options.useDatabase) {
      Logger.info('Configuring Question Service in online mode.')
      this.SERVICE = new QuestionService();
    } else {
      Logger.info('Configuring Question Service in offline mode.')
      this.SERVICE = new LocalQuestionService();
    }
  }

  static listen(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_CURRENT_QUESTION, () => this.SERVICE.getCurrentQuestion(socket));
    socket.on(Incoming.GET_AVAILABLE_CATEGORIES, () => this.SERVICE.getAvailableCategories(socket));
  }

  static listenAdmin(io: Server, socket: ClashSocket) {
    socket.on(Incoming.GET_QUESTION_SET, questionData => this.SERVICE.getQuestionSet(questionData, socket));
    socket.on(Incoming.ADD_QUESTION_SET, questionData => this.SERVICE.addQuestionSet(questionData, socket));
    socket.on(Incoming.CHANGE_QUESTION_SET, questionData => this.SERVICE.changeQuestionSet(questionData, socket));
    socket.on(Incoming.GET_ALL_QUESTION_SETS, () => this.SERVICE.getAllQuestionSets(socket));
    socket.on(Incoming.SKIP_QUESTION, () => this.SERVICE.skipQuestion(socket, io));
    socket.on(Incoming.GET_ANSWER, () => this.SERVICE.getAnswer(socket));
  }
}
