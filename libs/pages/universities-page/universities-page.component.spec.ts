import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitiesPageComponent } from './universities-page.component';

describe('UniversitiesPageComponent', () => {
  let component: UniversitiesPageComponent;
  let fixture: ComponentFixture<UniversitiesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversitiesPageComponent]
    });
    fixture = TestBed.createComponent(UniversitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
