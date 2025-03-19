import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyThroughUSComponent } from './apply-through-us.component';

describe('ApplyThroughUSComponent', () => {
  let component: ApplyThroughUSComponent;
  let fixture: ComponentFixture<ApplyThroughUSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyThroughUSComponent]
    });
    fixture = TestBed.createComponent(ApplyThroughUSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
