import { Game } from './game';
import { QuestionSet } from './question';
import { generateToken } from '../utils';

export { Room };

class Room {
  public name: string;
  public hash: string;
  public token: string;
  public game: Game;
  public questions?: QuestionSet;

  constructor(name: string, hash: string) {
    this.name = name;
    this.hash = hash;
    this.token = generateToken();
    this.game = new Game();
  }

  withQuestions(questions: QuestionSet) {
    this.questions = questions;
    return this;
  }
}
