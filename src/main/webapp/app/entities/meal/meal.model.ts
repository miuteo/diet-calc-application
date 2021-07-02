import { IFood } from 'app/entities/food/food.model';
import { MealName } from 'app/entities/enumerations/meal-name.model';

export interface IMeal {
  id?: number;
  mealTime?: MealName | null;
  foods?: IFood[] | null;
}

export class Meal implements IMeal {
  constructor(public id?: number, public mealTime?: MealName | null, public foods?: IFood[] | null) {}
}

export function getMealIdentifier(meal: IMeal): number | undefined {
  return meal.id;
}
