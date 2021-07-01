import * as dayjs from 'dayjs';
import { IMeal } from 'app/entities/meal/meal.model';

export interface IFood {
  id?: number;
  di?: dayjs.Dayjs | null;
  quantity?: number | null;
  meal?: IMeal | null;
}

export class Food implements IFood {
  constructor(public id?: number, public di?: dayjs.Dayjs | null, public quantity?: number | null, public meal?: IMeal | null) {}
}

export function getFoodIdentifier(food: IFood): number | undefined {
  return food.id;
}
