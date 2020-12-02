import { prop, getModelForClass } from '@typegoose/typegoose';

export { QuestionSetModel, QuestionSetSchema, CategorySchema, QuestionSchema };

class QuestionSchema {
  @prop()
  public content!: string;

  @prop({ type: () => [String] })
  public hints!: string[];
}

class CategorySchema {
  @prop()
  public name!: string;

  @prop({ type: () => [QuestionSchema], _id: false })
  public questions!: QuestionSchema[];
}

class QuestionSetSchema {
  @prop({ unique: true })
  public name!: string;

  @prop()
  public owner!: string;

  @prop({ type: () => [CategorySchema], _id: false })
  public categories!: CategorySchema[];
}

const QuestionSetModel = getModelForClass(QuestionSetSchema, {
  schemaOptions: { collection: 'questions', timestamps: true }
});
