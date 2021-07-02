import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserStatusDetailComponent } from './user-status-detail.component';

describe('Component Tests', () => {
  describe('UserStatus Management Detail Component', () => {
    let comp: UserStatusDetailComponent;
    let fixture: ComponentFixture<UserStatusDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserStatusDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userStatus: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserStatusDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserStatusDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userStatus on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userStatus).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
