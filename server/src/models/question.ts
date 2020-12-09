import { shuffle } from '../utils';
import { CategorySchema } from './schemas/question.schema';

export { QuestionSet, Question };

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
  public static BLACK_BOX_CATEGORY: string = 'blackBox';
  public static HINT_CATEGORY: string = 'hint';

  public name: string;
  public categories: Map<string, Question[]>;
  public current: {
    category: string;
    question?: Question;
    hintUsed: boolean;
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

  setCategory(categoryName: string) {
    this.current = { category: categoryName, hintUsed: false };
  }

  drawQuestion() {
    if (this.categories.has(this.current.category)) {
      const category = this.categories.get(this.current.category);
      const question = category.find(quest => !quest.used);
      if (question) {
        question.markUsed();
        this.current.question = question;
        return question;
      }
      return null;
    }
  }

  categoryExists(categoryName: string) {
    return (
      this.categories.has(categoryName) ||
      categoryName === QuestionSet.BLACK_BOX_CATEGORY ||
      categoryName === QuestionSet.HINT_CATEGORY
    );
  }

  reset() {
    this.current = null;
    this.categories.forEach(questions => questions.forEach(question => (question.used = false)));
  }
}
