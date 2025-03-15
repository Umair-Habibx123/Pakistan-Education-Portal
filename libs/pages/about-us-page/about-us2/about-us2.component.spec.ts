import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUs2Component } from './about-us2.component';

describe('AboutUs2Component', () => {
  let component: AboutUs2Component;
  let fixture: ComponentFixture<AboutUs2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUs2Component]
    });
    fixture = TestBed.createComponent(AboutUs2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
