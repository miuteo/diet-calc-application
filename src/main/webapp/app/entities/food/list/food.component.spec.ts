import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FoodService } from '../service/food.service';

import { FoodComponent } from './food.component';

describe('Component Tests', () => {
  describe('Food Management Component', () => {
    let comp: FoodComponent;
    let fixture: ComponentFixture<FoodComponent>;
    let service: FoodService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodComponent],
      })
        .overrideTemplate(FoodComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FoodService);

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
      expect(comp.foods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
