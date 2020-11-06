import { prop, getModelForClass } from '@typegoose/typegoose';
import { shuffle } from '../utils';

export { QuestionSetModel, QuestionSetSchema, QuestionSetInternal, QuestionSetShared, QuestionInternal };

class QuestionSchema {
  @prop()
  public content!: string;

  @prop({ type: () => [String] })
  public hints!: string[];
}

class CategorySchema {
  @prop()
  public name!: string;

  @prop({ type: () => [QuestionSchema] })
  public questions!: QuestionSchema[];
}

class QuestionSetSchema {
  @prop({ unique: true })
  public name!: string;

  @prop({ type: () => [CategorySchema] })
  public categories!: CategorySchema[];
}

const QuestionSetModel = getModelForClass(QuestionSetSchema, {
  schemaOptions: { collection: 'questions', timestamps: true }
});

interface QuestionSetShared {
  name: string;
  file?: any;
}

class QuestionInternal {
  public content: string;
  public hints: string[];
  public answer: string;
  public used: boolean = false;

  constructor(content: string, hints: string[]) {
    this.content = content;
    this.answer = hints[0];
    this.hints = shuffle(hints);
  }

  public markUsed() {
    this.used = true;
  }
}

class QuestionSetInternal {
  public name: string;
  public categories: Map<string, QuestionInternal[]>;
  public currentQuestion: QuestionInternal;

  constructor(name: string, categories: CategorySchema[]) {
    this.name = name;
    this.categories = new Map(
      categories.map(i => {
        const questions = i.questions.map(quest => new QuestionInternal(quest.content, quest.hints));
        return [i.name, shuffle(questions)];
      })
    );
  }

  public getNextQuestion(categoryName: string) {
    const categories = this.categories.get(categoryName);
    const question = categories.find(quest => !quest.used);
    question.markUsed();
    this.currentQuestion = question;
    return question;
  }

  public getCurrentQuestion() {
    return this.currentQuestion;
  }
}
