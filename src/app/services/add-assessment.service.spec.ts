import { TestBed } from '@angular/core/testing';

import { AddAssessmentService } from './add-assessment.service';

describe('AddAssessmentService', () => {
  let service: AddAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
