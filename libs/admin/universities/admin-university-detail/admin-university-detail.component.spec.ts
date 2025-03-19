import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUniversityDetailComponent } from './admin-university-detail.component';

describe('AdminUniversityDetailComponent', () => {
  let component: AdminUniversityDetailComponent;
  let fixture: ComponentFixture<AdminUniversityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUniversityDetailComponent]
    });
    fixture = TestBed.createComponent(AdminUniversityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
