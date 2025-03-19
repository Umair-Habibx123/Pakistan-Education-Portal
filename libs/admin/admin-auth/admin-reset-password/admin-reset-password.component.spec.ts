import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResetPasswordComponent } from './admin-reset-password.component';

describe('AdminResetPasswordComponent', () => {
  let component: AdminResetPasswordComponent;
  let fixture: ComponentFixture<AdminResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminResetPasswordComponent]
    });
    fixture = TestBed.createComponent(AdminResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
