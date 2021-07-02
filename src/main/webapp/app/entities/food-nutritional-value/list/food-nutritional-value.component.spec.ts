import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';

import { FoodNutritionalValueComponent } from './food-nutritional-value.component';

describe('Component Tests', () => {
  describe('FoodNutritionalValue Management Component', () => {
    let comp: FoodNutritionalValueComponent;
    let fixture: ComponentFixture<FoodNutritionalValueComponent>;
    let service: FoodNutritionalValueService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodNutritionalValueComponent],
      })
        .overrideTemplate(FoodNutritionalValueComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodNutritionalValueComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FoodNutritionalValueService);

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
      expect(comp.foodNutritionalValues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
