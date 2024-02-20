import { TestBed } from '@angular/core/testing';

import { GridInteractionService } from './grid-interaction.service';

describe('GridInteractionService', () => {
  let service: GridInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
