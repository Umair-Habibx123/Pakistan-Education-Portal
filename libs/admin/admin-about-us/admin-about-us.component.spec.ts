import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutUsComponent } from './admin-about-us.component';

describe('AdminAboutUsComponent', () => {
  let component: AdminAboutUsComponent;
  let fixture: ComponentFixture<AdminAboutUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAboutUsComponent]
    });
    fixture = TestBed.createComponent(AdminAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
