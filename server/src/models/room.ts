import { Game } from './game';
import { QuestionSet } from './question';
import { generateToken } from '../utils';

export { Room };

class Room {
  public name: string;
  public token: string;
  public game: Game;
  public questions?: QuestionSet;

  constructor(name: string) {
    this.name = name;
    this.token = generateToken();
    this.game = new Game();
  }

  withToken() {
    this.token = generateToken();
    return this;
  }

  withQuestions(questions: QuestionSet) {
    this.questions = questions;
    return this;
  }
}
