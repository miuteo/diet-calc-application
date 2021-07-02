import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MealService } from '../service/meal.service';

import { MealComponent } from './meal.component';

describe('Component Tests', () => {
  describe('Meal Management Component', () => {
    let comp: MealComponent;
    let fixture: ComponentFixture<MealComponent>;
    let service: MealService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MealComponent],
      })
        .overrideTemplate(MealComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MealComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MealService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.meals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
