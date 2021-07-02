import * as dayjs from 'dayjs';
import { IFood } from 'app/entities/food/food.model';

export interface IFoodNutritionalValue {
  id?: number;
  di?: dayjs.Dayjs | null;
  name?: string | null;
  protein?: number | null;
  proteinCal?: number | null;
  fat?: number | null;
  fatCal?: number | null;
  carbohydrate?: number | null;
  carbohydrateCal?: number | null;
  quantity?: number | null;
  isProteinPowder?: boolean | null;
  foodNutritionalValue?: IFood | null;
}

export class FoodNutritionalValue implements IFoodNutritionalValue {
  constructor(
    public id?: number,
    public di?: dayjs.Dayjs | null,
    public name?: string | null,
    public protein?: number | null,
    public proteinCal?: number | null,
    public fat?: number | null,
    public fatCal?: number | null,
    public carbohydrate?: number | null,
    public carbohydrateCal?: number | null,
    public quantity?: number | null,
    public isProteinPowder?: boolean | null,
    public foodNutritionalValue?: IFood | null
  ) {
    this.isProteinPowder = this.isProteinPowder ?? false;
  }
}

export function getFoodNutritionalValueIdentifier(foodNutritionalValue: IFoodNutritionalValue): number | undefined {
  return foodNutritionalValue.id;
}
