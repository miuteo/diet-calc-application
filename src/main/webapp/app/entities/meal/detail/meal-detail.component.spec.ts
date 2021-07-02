import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MealDetailComponent } from './meal-detail.component';

describe('Component Tests', () => {
  describe('Meal Management Detail Component', () => {
    let comp: MealDetailComponent;
    let fixture: ComponentFixture<MealDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MealDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ meal: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MealDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MealDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load meal on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.meal).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
