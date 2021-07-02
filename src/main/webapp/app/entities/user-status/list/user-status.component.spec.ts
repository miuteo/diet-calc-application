import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserStatusService } from '../service/user-status.service';

import { UserStatusComponent } from './user-status.component';

describe('Component Tests', () => {
  describe('UserStatus Management Component', () => {
    let comp: UserStatusComponent;
    let fixture: ComponentFixture<UserStatusComponent>;
    let service: UserStatusService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStatusComponent],
      })
        .overrideTemplate(UserStatusComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStatusComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UserStatusService);

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
      expect(comp.userStatuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
