import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodNutritionalCustomComponent } from './food-nutritional-custom.component';

describe('FoodNutritionalCustomComponent', () => {
  let component: FoodNutritionalCustomComponent;
  let fixture: ComponentFixture<FoodNutritionalCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodNutritionalCustomComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodNutritionalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
