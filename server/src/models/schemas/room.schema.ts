import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { QuestionSetSchema } from './question.schema';

export { RoomModel, RoomSchema };

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
