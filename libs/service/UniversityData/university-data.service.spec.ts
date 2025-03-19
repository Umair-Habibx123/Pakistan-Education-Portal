import { TestBed } from '@angular/core/testing';

import { UniversityDataService } from './university-data.service';

describe('UniversityDataService', () => {
  let service: UniversityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
