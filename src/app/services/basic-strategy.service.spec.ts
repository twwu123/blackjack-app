import { TestBed } from '@angular/core/testing';

import { BasicStrategyService } from './basic-strategy.service';

describe('BasicStrategyService', () => {
  let service: BasicStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
