import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityDetailComponent } from './university-detail.component';

describe('UniversityDetailComponent', () => {
  let component: UniversityDetailComponent;
  let fixture: ComponentFixture<UniversityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversityDetailComponent]
    });
    fixture = TestBed.createComponent(UniversityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
