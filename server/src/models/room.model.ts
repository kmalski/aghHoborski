import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { QuestionSet, QuestionSetSchema } from './question.model';
import { Game } from './game.model';
import { generateToken } from '../utils';

export { RoomModel, RoomData, Room };

class RoomSchema {
  @prop({ unique: true })
  public name!: string;

  @prop()
  public hash!: string;

  @prop({ ref: () => QuestionSetSchema })
  public questions: Ref<QuestionSetSchema>;
}

const RoomModel = getModelForClass(RoomSchema, {
  schemaOptions: { collection: 'rooms' }
});

interface RoomData {
  name: string;
  token?: string;
  readonly password?: string;
}

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
