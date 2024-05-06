import { TestBed } from '@angular/core/testing';

import { PaisesServiceService } from './paises-service.service';

describe('PaisesServiceService', () => {
  let service: PaisesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaisesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
