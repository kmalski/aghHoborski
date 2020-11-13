import { prop, getModelForClass } from '@typegoose/typegoose';
import { shuffle } from '../utils';

export { QuestionSetModel, QuestionSetSchema, QuestionSetData, QuestionSet, Question };

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

interface QuestionSetData {
  name?: string;
  file?: any;
  categoryName?: string;
}

class Question {
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

class QuestionSet {
  public name: string;
  public categories: Map<string, Question[]>;
  public current: {
    category: string;
    question: Question;
  };

  constructor(name: string, categories: CategorySchema[]) {
    this.name = name;
    this.categories = new Map(
      categories.map(category => {
        const questions = category.questions.map(quest => new Question(quest.content, quest.hints));
        return [category.name, shuffle(questions)];
      })
    );
  }

  getNextQuestion(categoryName: string) {
    const category = this.categories.get(categoryName);
    const question = category.find(quest => !quest.used);
    question.markUsed();
    this.current = { category: categoryName, question };
    return question;
  }

  categoryExists(categoryName: string) {
    return this.categories.has(categoryName);
  }
}
