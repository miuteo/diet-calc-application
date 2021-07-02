import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FoodNutritionalValueDetailComponent } from './food-nutritional-value-detail.component';

describe('Component Tests', () => {
  describe('FoodNutritionalValue Management Detail Component', () => {
    let comp: FoodNutritionalValueDetailComponent;
    let fixture: ComponentFixture<FoodNutritionalValueDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FoodNutritionalValueDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ foodNutritionalValue: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FoodNutritionalValueDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FoodNutritionalValueDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load foodNutritionalValue on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.foodNutritionalValue).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
