import { shuffle } from '../utils';
import { CategorySchema } from './schemas/question.schema';

export { QuestionSet, Question };

class Question {
  public content: string;
  public hints: string[];
  public answer: string;
  public used = false;

  constructor(content: string, hints: string[]) {
    this.content = content;
    this.answer = hints[0];
    this.hints = shuffle(hints);
  }

  public markUsed(): void {
    this.used = true;
  }
}

class QuestionSet {
  public static BLACK_BOX_CATEGORY = 'blackBox';
  public static HINT_CATEGORY = 'hint';

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

  setCategory(categoryName: string): void {
    this.current = { category: categoryName, hintUsed: false };
  }

  drawQuestion(): Question {
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

  drawCategories(limit = 7): string[] {
    let count = 0;
    const result: string[] = [];
    for (const category of this.categories.keys()) {
      if (this.hasNotUsedQuestion(category)) {
        result.push(category);
        count += 1;
      }
      if (count >= limit) break;
    }
    if (count % 2 === 0) result.pop();
    return result;
  }

  categoryExists(categoryName: string): boolean {
    return (
      this.categories.has(categoryName) ||
      categoryName === QuestionSet.BLACK_BOX_CATEGORY ||
      categoryName === QuestionSet.HINT_CATEGORY
    );
  }

  reset(): void {
    this.current = null;
    this.categories.forEach(questions => questions.forEach(question => (question.used = false)));
  }

  resetCurrent(): void {
    this.current = null;
  }

  private hasNotUsedQuestion(category: string): boolean {
    const categoryQuestions = this.categories.get(category);
    return categoryQuestions.some(quest => !quest.used);
  }
}
