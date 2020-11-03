import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { QuestionSetInternal, QuestionSetSchema } from './question.model';

export { RoomModel, RoomShared, RoomInternal };

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

interface Room {
  name: string;
  token?: string;
}

interface RoomShared extends Room {
  name: string;
  readonly password?: string;
}

class RoomInternal implements Room {
  public name: string;
  public token?: string;
  public questions?: QuestionSetInternal;
}
