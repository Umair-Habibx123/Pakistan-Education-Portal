import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnterCodeComponent } from './admin-enter-code.component';

describe('AdminEnterCodeComponent', () => {
  let component: AdminEnterCodeComponent;
  let fixture: ComponentFixture<AdminEnterCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEnterCodeComponent]
    });
    fixture = TestBed.createComponent(AdminEnterCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
