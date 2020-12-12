import { Team } from './team';

export { OneOnOne };

interface Category {
  name: string;
  enabled: boolean;
}

class OneOnOne {
  public categories: Category[];
  public teams: [Team, Team];

  constructor(categories: string[], teams: [Team, Team]) {
    this.categories = categories.map(category => {
        return { name: category, enabled: true };
      }
    );
    this.teams = teams;
  }

  setCategoryState(category: string, enabled: boolean): Category {
    const foundCateg = this.categories.find(categ => categ.name === category);
    foundCateg.enabled = enabled;
    return foundCateg;
  }

  getEnabledCategories(): Category[] {
    return this.categories.filter(category => category.enabled === true);
  }

  getCategory(): Category {
    return this.categories.find(category => category.enabled === true);
  }
}