import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUniversitiesComponent } from './partner-universities.component';

describe('PartnerUniversitiesComponent', () => {
  let component: PartnerUniversitiesComponent;
  let fixture: ComponentFixture<PartnerUniversitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerUniversitiesComponent]
    });
    fixture = TestBed.createComponent(PartnerUniversitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
